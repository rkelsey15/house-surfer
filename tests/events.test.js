// Run with: npm test
import assert from 'node:assert/strict'
import { test } from 'node:test'

const makeStorage = (fail = false) => {
  const m = new Map()
  return {
    getItem: (k) => (m.has(k) ? m.get(k) : null),
    setItem: (k, v) => { if (fail) throw new Error('full'); m.set(k, v) },
    removeItem: (k) => m.delete(k),
  }
}

test('logEvent stores name, time, handle and fields; keeps the last 2000 (AC 7.2, 7.4)', async () => {
  globalThis.localStorage = makeStorage()
  localStorage.setItem('hs.profile', JSON.stringify({ handle: 'Me' }))
  const { logEvent, readEvents } = await import('../src/lib/events.js')
  logEvent('rating_submitted', { home_id: 'h1', stars: 4, is_edit: false })
  const [e] = readEvents()
  assert.equal(e.name, 'rating_submitted')
  assert.equal(e.handle, 'Me')
  assert.equal(e.stars, 4)
  assert.ok(e.at)
  for (let i = 0; i < 2100; i++) logEvent('home_viewed', { n: i })
  const all = readEvents()
  assert.equal(all.length, 2000)
  assert.equal(all.at(-1).n, 2099)
})

test('logEvent fails quietly when storage is full (AC 7.3)', async () => {
  globalThis.localStorage = makeStorage(true)
  const { logEvent } = await import('../src/lib/events.js')
  assert.doesNotThrow(() => logEvent('app_opened'))
})
