// Comment check: blocks comments about the people who live at a home, and
// insults or slurs. Rule-based, so it is a first screen, not a mind reader.
// The word lists are in moderation-words.js.
import { ALLOWED_PHRASES, BLOCK_MESSAGE, INSULT_WORDS, PERSON_PHRASES, PERSON_WORDS } from './moderation-words.js'

// HOW A COMMENT IS CHECKED, in order (see `moderate` below):
//   1. tokenize: lowercase, drop accents and hidden characters, cut into words, and
//      glue spaced-out letters back together ("o w n e r s" becomes "owners").
//   2. readings: for each word, also try it with number/symbol swaps undone
//      ("n3ighbors", "0wners"), and with repeated letters squeezed ("ownerrrs").
//   3. skip allowed phrases such as "family room", which describe the house.
//   4. look each word up in the blocked lists. Whole words only, so "neighborhood"
//      is fine while "neighbor" is not. An insult beats a person word as the reason.
//   5. look for blocked multi-word phrases.
// WHY rules and not AI: it is free, instant and works offline in a demo. It WILL miss
// clever wording and sometimes block a harmless comment ("man cave"). The case study
// says so up front, and V2 adds an AI check on top. Tune the lists in
// moderation-words.js and add a case to tests/moderation.test.js for each change.

// Number and symbol swaps people use to dodge a filter. "1" is handled
// separately because it can stand for "i" or "l".
const SWAPS = { 0: 'o', 3: 'e', 4: 'a', 5: 's', 7: 't', '@': 'a', $: 's' }

// "ownerrrs" -> "owners". Lists are squeezed the same way, so both sides match.
const squeeze = (word) => word.replace(/(.)\1+/g, '$1')

const WORD_REASON = new Map([
  ...PERSON_WORDS.map((w) => [squeeze(w), 'person']),
  ...INSULT_WORDS.map((w) => [squeeze(w), 'insult']),
])
const phrases = (list) => list.map((p) => p.map(squeeze))
const PERSON_PHRASES_SQ = phrases(PERSON_PHRASES)
const ALLOWED_PHRASES_SQ = phrases(ALLOWED_PHRASES)

const SINGLE = /^[a-z0-9@$]$/

// Lowercase, drop accents and hidden characters, then cut into words.
// Joins spaced-out letters: "o w n e r s", "o.w.n.e.r.s", "o-w-n-e-r-s".
function tokenize(text) {
  const clean = text
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[̀-ͯ­​-‍﻿]/g, '')
  const words = clean
    .split(/[^a-z0-9@$'’-]+/)
    .map((t) => t.replace(/^[-'’]+|[-'’]+$/g, '').replace(/['’]s$/, ''))
    .filter(Boolean)
    .map((t) => (/^(?:[a-z0-9@$]-){2,}[a-z0-9@$]$/.test(t) ? t.replace(/-/g, '') : t))

  const out = []
  for (let i = 0; i < words.length; ) {
    let j = i
    while (j < words.length && SINGLE.test(words[j])) j++
    if (j - i >= 3) {
      out.push(words.slice(i, j).join(''))
      i = j
    } else {
      out.push(words[i])
      i++
    }
  }
  return out
}

// The ways a word could be read once number swaps are undone. Only words that
// mix letters with swap characters are changed, so "10/10" and "1950s" are safe.
function readings(word) {
  const found = new Set([word])
  if (/[a-z]/.test(word) && /[013457@$]/.test(word)) {
    const base = word.replace(/[03457@$]/g, (c) => SWAPS[c])
    found.add(base.replace(/1/g, 'i'))
    found.add(base.replace(/1/g, 'l'))
  }
  return [...found].map(squeeze)
}

const phraseAt = (words, i, phrase) => phrase.every((p, k) => words[i + k]?.includes(p))

// Returns { ok: true }, or { ok: false, reason: 'person' | 'insult' }.
// The reason is for counting blocks; the comment text is never saved.
export function moderate(text) {
  const words = tokenize(text ?? '').map(readings)

  // "family room" and friends describe the house, so those words are skipped.
  const skip = new Array(words.length).fill(false)
  for (const phrase of ALLOWED_PHRASES_SQ) {
    for (let i = 0; i < words.length; i++) {
      if (phraseAt(words, i, phrase)) phrase.forEach((_, k) => (skip[i + k] = true))
    }
  }

  let reason = null
  words.forEach((reads, i) => {
    if (skip[i]) return
    for (const r of reads) {
      const hit = WORD_REASON.get(r)
      if (hit === 'insult') reason = 'insult'
      else if (hit && reason !== 'insult') reason = 'person'
    }
  })
  if (!reason && PERSON_PHRASES_SQ.some((p) => words.some((_, i) => phraseAt(words, i, p)))) reason = 'person'

  return reason ? { ok: false, reason } : { ok: true }
}

// What the comment boxes call. Returns null when the text is fine, or the
// message to show the user.
export function checkComment(text) {
  return moderate(text).ok ? null : BLOCK_MESSAGE
}
