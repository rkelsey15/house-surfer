// Part J: badge unlock rules, the profile picture choice, and the badge_earned event name.
import test from 'node:test'
import assert from 'node:assert/strict'
import { BADGE_RULES, NEEDS_OTHERS, earnedBadgeIds, snappedHomeCount } from '../src/lib/badgeRules.js'
import { BADGES } from '../src/lib/profileLists.js'
import { AVATARS, DEFAULT_AVATAR, avatarName, cleanAvatar } from '../src/lib/avatars.js'
import { EVENT_NAMES } from '../src/lib/stats.js'

test('First Steps at 5 ratings, Block Walker at 25', () => {
  assert.deepEqual(earnedBadgeIds({ ratingCount: 4 }), [])
  assert.deepEqual(earnedBadgeIds({ ratingCount: 5 }), ['first-steps'])
  assert.deepEqual(earnedBadgeIds({ ratingCount: 24 }), ['first-steps'])
  assert.deepEqual(earnedBadgeIds({ ratingCount: 25 }), ['first-steps', 'block-walker'])
})

test('Good Neighbor Voice at 10 comments', () => {
  assert.deepEqual(earnedBadgeIds({ commentCount: 9 }), [])
  assert.deepEqual(earnedBadgeIds({ commentCount: 10 }), ['voice'])
})

test('Curb Photographer needs 5 different houses, not 5 photos', () => {
  const photos = ['a', 'a', 'b', 'c', 'd', 'd'].map((home_id) => ({ home_id }))
  assert.equal(snappedHomeCount(photos), 4)
  assert.deepEqual(earnedBadgeIds({ snappedHomes: snappedHomeCount(photos) }), [])
  assert.deepEqual(earnedBadgeIds({ snappedHomes: snappedHomeCount([...photos, { home_id: 'e' }]) }), ['photographer'])
  assert.equal(snappedHomeCount([]), 0)
})

test('Crowd Favorite and Surfer Elite never unlock in the demo, whatever the numbers', () => {
  const all = earnedBadgeIds({ ratingCount: 999, commentCount: 999, snappedHomes: 999 })
  assert.deepEqual(all.sort(), ['block-walker', 'first-steps', 'photographer', 'voice'])
  assert.deepEqual([...NEEDS_OTHERS].sort(), ['elite', 'liked'])
  for (const id of NEEDS_OTHERS) assert.ok(BADGES.find((b) => b.id === id).needsOthers)
})

test('every badge is earnable by a rule or marked as needing other surfers; the text matches the rule', () => {
  for (const b of BADGES) assert.ok(BADGE_RULES[b.id] || b.needsOthers, b.id)
  assert.match(BADGES.find((b) => b.id === 'first-steps').detail, /5 homes/)
  assert.match(BADGES.find((b) => b.id === 'block-walker').detail, /25 homes/)
  assert.match(BADGES.find((b) => b.id === 'voice').detail, /10 comments/)
  assert.match(BADGES.find((b) => b.id === 'photographer').detail, /5 houses/)
})

test('badge_earned is a known event', () => {
  assert.ok(EVENT_NAMES.includes('badge_earned'))
})

test('eight built-in avatars, each with its own id, name and colors', () => {
  assert.equal(AVATARS.length, 8)
  assert.equal(new Set(AVATARS.map((a) => a.id)).size, 8)
  assert.equal(new Set(AVATARS.map((a) => a.fg)).size, 8)
  assert.ok(AVATARS.every((a) => a.fg.startsWith('--') && a.bg.startsWith('--')))
  assert.equal(avatarName('purple'), 'Purple house')
})

test('the saved avatar is one id; anything unknown falls back to the default', () => {
  assert.equal(cleanAvatar('coral'), 'coral')
  for (const bad of [null, undefined, 3, 'nope', {}, ['coral']]) assert.equal(cleanAvatar(bad), DEFAULT_AVATAR)
})

test('the avatar is saved under hs.avatar and Reset demo clears it', async () => {
  const store = new Map()
  globalThis.localStorage = {
    getItem: (k) => (store.has(k) ? store.get(k) : null),
    setItem: (k, v) => store.set(k, String(v)),
    removeItem: (k) => store.delete(k),
    key: (i) => [...store.keys()][i] ?? null,
    get length() { return store.size },
  }
  const { readJSON, writeJSON, clearAllData } = await import('../src/lib/storage.js')
  writeJSON('hs.avatar', 'pink')
  assert.equal(cleanAvatar(readJSON('hs.avatar', DEFAULT_AVATAR)), 'pink')
  clearAllData()
  assert.equal(readJSON('hs.avatar', null), null)
  assert.equal(cleanAvatar(readJSON('hs.avatar', DEFAULT_AVATAR)), DEFAULT_AVATAR)
  delete globalThis.localStorage
})
