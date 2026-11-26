// The rate-before-you-comment rule: Skip, Rate and Next, Rate and comment.
import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { RATE_FIRST_MESSAGE, canPostComment } from '../src/lib/commentRule.js'

const read = (p) => readFileSync(new URL(p, import.meta.url), 'utf8')

test('a new comment is blocked without a rating', () => {
  assert.equal(canPostComment({ stars: 0 }), false)
  assert.equal(canPostComment({}), false)
  assert.equal(canPostComment({ stars: undefined }), false)
})

test('a new comment is allowed after rating (any of 1 to 5 stars)', () => {
  for (const stars of [1, 2, 3, 4, 5]) assert.equal(canPostComment({ stars }), true)
})

test('a new comment is allowed if the home was already rated earlier', () => {
  // "Already rated" is just a saved rating of this home: the stars come from hs.ratings.
  const ratings = { abc123: { stars: 4, at: '2026-11-20T10:00:00Z' } }
  assert.equal(canPostComment({ stars: ratings.abc123?.stars }), true)
  assert.equal(canPostComment({ stars: ratings.other?.stars }), false, 'a different home is not rated')
})

test('replies are allowed without a rating', () => {
  assert.equal(canPostComment({ stars: 0, isReply: true }), true)
  assert.equal(canPostComment({ isReply: true }), true)
})

test('the message under the box is the agreed line', () => {
  assert.equal(RATE_FIRST_MESSAGE, 'Rate this home to leave a comment.')
})

test('the home page wires the rule to the top-level box only: replies and edits are not gated', () => {
  const src = read('../src/screens/HomePage.jsx')
  // The top-level composer gets needsRating from the rule.
  assert.match(src, /placeholder="Say something about the house…"[^\n]*needsRating=\{!canPostComment\(\{ stars: mine \}\)\}/)
  // Reply and edit composers never pass it.
  const composers = [...src.matchAll(/<Composer[\s\S]*?\/>|<Composer[\s\S]*?>\s*\n/g)].map((m) => m[0])
  const others = composers.filter((c) => !c.includes('Say something about the house'))
  assert.ok(others.length >= 2, 'reply and edit composers exist')
  for (const c of others) assert.ok(!c.includes('needsRating'), c.slice(0, 60))
  // Post stays reachable but inactive, and the line is announced.
  assert.match(src, /aria-disabled=\{needsRating \? true : undefined\}/)
  assert.match(src, /role="status"[^\n]*RATE_FIRST_MESSAGE|RATE_FIRST_MESSAGE[^\n]*role="status"|role="status">\{needsRating \? RATE_FIRST_MESSAGE/)
  // submit does nothing while a rating is needed.
  assert.match(src, /if \(!t \|\| needsRating\) return/)
})

test('Surf has no comment-and-skip path: Skip has no comment, Next needs a rating', () => {
  const src = read('../src/screens/Surf.jsx')
  assert.match(src, /<button className="btn pri" onClick=\{next\} disabled=\{!mine\}>Next<\/button>/)
  assert.match(src, /compose: mine > 0/, 'the composer is only auto-opened after a rating')
  assert.ok(!/Skip[\s\S]{0,40}comment/i.test(src.replace(/\/\/.*$/gm, '')))
})

test('the Try this wording matches the rule', () => {
  const src = read('../src/lib/GuideContext.jsx')
  assert.ok(src.includes("label: 'Rate 3 homes'"))
  assert.ok(src.includes("label: 'Rate a home, then comment on it'"))
  assert.ok(!src.includes('Open a home and comment'))
})
