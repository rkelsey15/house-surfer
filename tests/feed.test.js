// Run with: npm test
import assert from 'node:assert/strict'
import { beforeEach, test } from 'node:test'
import { advanceFeed, buildQueue, feed, getQueue, setPos } from '../src/lib/feedSession.js'

const homes = ['a', 'b', 'c', 'd'].map((id) => ({ id }))
beforeEach(() => Object.assign(feed, { homes: null, queue: [], pos: 0 }))

test('queue leaves out rated homes and keeps the rest', () => {
  const q = buildQueue(homes, { b: { stars: 4 } })
  assert.deepEqual(q.map((h) => h.id).sort(), ['a', 'c', 'd'])
})

test('the queue is built once per set of homes and keeps its order', () => {
  const q1 = getQueue(homes, {})
  const q2 = getQueue(homes, { a: { stars: 3 } }) // rating does not reshuffle
  assert.equal(q1, q2)
})

test('Next house goes to the house after this one and remembers your place', () => {
  const q = getQueue(homes, {})
  const next = advanceFeed(homes, {}, q[0].id)
  assert.equal(next.id, q[1].id)
  assert.equal(feed.pos, 1)
  const again = advanceFeed(homes, {}, q[1].id)
  assert.equal(again.id, q[2].id)
  assert.equal(feed.pos, 2)
})

test('at the end of the feed there is no next house and the place moves past the end', () => {
  const q = getQueue(homes, {})
  assert.equal(advanceFeed(homes, {}, q[3].id), null)
  assert.equal(feed.pos, 4)
})

test('if the current home is not in the queue, carry on from your saved place', () => {
  getQueue(homes, {})
  setPos(1) // you are looking at queue[1]
  const next = advanceFeed(homes, {}, 'not-in-queue')
  assert.equal(next.id, feed.queue[2].id)
})
