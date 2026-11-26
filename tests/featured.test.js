// Part K: the featured badge (default, one-badge limit, saved choice) and the surfer card.
import test from 'node:test'
import assert from 'node:assert/strict'
import { cleanFeatured, defaultFeatured, resolveFeatured } from '../src/lib/featured.js'
import { SAMPLE_SURFERS, buildSurferCard, sampleCard, sampleEarned } from '../src/lib/surfers.js'
import { BADGES } from '../src/lib/profileLists.js'
import { earnedBadgeIds, NEEDS_OTHERS } from '../src/lib/badgeRules.js'

test('default featured badge: Surfer Elite if earned, else the first earned, else none', () => {
  assert.equal(defaultFeatured([]), null)
  assert.equal(defaultFeatured(['block-walker', 'voice']), 'block-walker')
  assert.equal(defaultFeatured(['first-steps', 'voice', 'elite']), 'elite')
  assert.equal(resolveFeatured(null, ['voice', 'photographer']), 'voice')
})

test('only one badge is featured: the result is a single id, never a list', () => {
  const earned = ['first-steps', 'block-walker', 'voice']
  for (const saved of [null, 'voice', ['voice', 'first-steps'], { id: 'voice' }, 7, undefined]) {
    const out = resolveFeatured(saved, earned)
    assert.equal(typeof out, 'string')
    assert.ok(earned.includes(out))
  }
  assert.equal(cleanFeatured(['voice', 'first-steps']), null, 'a list is not a valid saved value')
  assert.equal(cleanFeatured('voice'), 'voice')
})

test('a saved choice wins while it is earned; if it is no longer earned the default returns', () => {
  const earned = ['first-steps', 'block-walker', 'voice']
  assert.equal(resolveFeatured('voice', earned), 'voice')
  assert.equal(resolveFeatured('photographer', earned), 'first-steps', 'not earned, so ignored')
  assert.equal(resolveFeatured('voice', ['first-steps']), 'first-steps', 'comment deleted, badge gone')
  assert.equal(resolveFeatured('voice', []), null)
})

test('the choice is saved as one value under hs.featured_badge and Reset demo clears it', async () => {
  const store = new Map()
  globalThis.localStorage = {
    getItem: (k) => (store.has(k) ? store.get(k) : null),
    setItem: (k, v) => store.set(k, String(v)),
    removeItem: (k) => store.delete(k),
    key: (i) => [...store.keys()][i] ?? null,
    get length() { return store.size },
  }
  const { readJSON, writeJSON, clearAllData } = await import('../src/lib/storage.js')
  writeJSON('hs.featured_badge', 'voice')
  assert.equal(store.get('hs.featured_badge'), '"voice"')
  assert.equal(cleanFeatured(readJSON('hs.featured_badge', null)), 'voice')
  clearAllData()
  assert.equal(cleanFeatured(readJSON('hs.featured_badge', null)), null)
  delete globalThis.localStorage
})

test('the surfer card has only: handle, sample, since, rated, comments, badges, featured', () => {
  const card = buildSurferCard({ handle: 'CedarSurfer12', since: '2026-05-19', rated: 8, comments: 11, earnedIds: ['first-steps', 'voice'], sample: true })
  assert.deepEqual(Object.keys(card).sort(), ['badges', 'comments', 'featured', 'handle', 'rated', 'sample', 'since'])
  assert.deepEqual(Object.keys(card.badges[0]).sort(), ['how', 'id', 'name'])
})

test('the surfer card never includes karma, locked badges, progress, activity or ratings', () => {
  // Even if the caller passes extra fields, the card drops them.
  const card = buildSurferCard({
    handle: 'X1', since: '2026-01-01', rated: 5, comments: 1, earnedIds: ['first-steps'],
    karma: 999, locked: ['elite'], progress: 0.5, activity: [1], ratings: { a: 5 },
  })
  const text = JSON.stringify(card).toLowerCase()
  for (const word of ['karma', 'locked', 'progress', 'activity', 'ratings', 'surfer elite', 'crowd favorite', 'curb photographer']) {
    assert.ok(!text.includes(word), word)
  }
  assert.deepEqual(card.badges.map((b) => b.id), ['first-steps'], 'earned badges only')
  // With nothing earned the card lists no badges at all (not the locked ones).
  assert.deepEqual(buildSurferCard({ handle: 'X2' }).badges, [])
})

test('sample surfers: at least 3 have details and 1 to 3 earned badges, consistent with the rules', () => {
  const names = Object.keys(SAMPLE_SURFERS)
  assert.ok(names.length >= 3 && names.length <= 4)
  for (const name of names) {
    const s = SAMPLE_SURFERS[name]
    const earned = sampleEarned(s)
    assert.ok(earned.length >= 1 && earned.length <= 3, `${name}: ${earned.length} badges`)
    // Badges that can be earned in the demo follow the real rules; only V2 badges are pretended.
    const byRule = earnedBadgeIds({ ratingCount: s.rated, commentCount: s.comments, snappedHomes: s.snapped })
    for (const id of earned) assert.ok(byRule.includes(id) || NEEDS_OTHERS.includes(id), `${name}: ${id}`)
    const card = sampleCard(name)
    assert.equal(card.sample, true)
    assert.deepEqual(card.badges.map((b) => b.id), earned)
    assert.ok(!JSON.stringify(card).toLowerCase().includes('karma'))
  }
  // Surfer Elite needs 25+ comments by its own rule, so a sample Elite has them.
  const elite = Object.values(SAMPLE_SURFERS).find((s) => s.extra.includes('elite'))
  assert.ok(elite && elite.comments >= BADGES.find((b) => b.id === 'elite').rule.comments)
  assert.equal(sampleCard('TurretTom21').featured, 'elite', 'Elite is the default featured badge')
})

test('a sample commenter without details gets a bare "Sample surfer" card', () => {
  const card = sampleCard('MossyRoof3')
  assert.equal(card.sample, true)
  assert.equal(card.since, null)
  assert.deepEqual(card.badges, [])
  assert.equal(card.featured, null)
})
