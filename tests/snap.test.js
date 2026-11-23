// Run with: npm test
import assert from 'node:assert/strict'
import { test } from 'node:test'
import { fitWithin } from '../src/lib/imageTools.js'
import { metersBetween, nearestHomes, searchHomes } from '../src/lib/nearest.js'

test('fitWithin shrinks the longest side to 1200 (AC 4.8)', () => {
  assert.deepEqual(fitWithin(4032, 3024), { width: 1200, height: 900 })
  assert.deepEqual(fitWithin(3024, 4032), { width: 900, height: 1200 })
  assert.deepEqual(fitWithin(1600, 1200), { width: 1200, height: 900 })
})

test('fitWithin never enlarges a small photo', () => {
  assert.deepEqual(fitWithin(800, 600), { width: 800, height: 600 })
  assert.deepEqual(fitWithin(1200, 1200), { width: 1200, height: 1200 })
})

const homes = [
  { id: 'a', address: '2400 block of Warren Ave N', lat: 47.6400, lng: -122.3500 },
  { id: 'b', address: '2400 block of 1st Ave N', lat: 47.6401, lng: -122.3501 },
  { id: 'c', address: '300 block of Prospect St', lat: 47.6300, lng: -122.3600 },
  { id: 'd', address: '0–99 block of Aloha St', lat: 47.6270, lng: -122.3560 },
  { id: 'e', address: '1500 block of 4th Ave W', lat: 47.6350, lng: -122.3700 },
  { id: 'f', address: '200 block of W Boston St', lat: 47.6420, lng: -122.3650 },
  { id: 'g', address: '800 block of W Etruria St', lat: 47.6380, lng: -122.3580 },
]

test('nearestHomes returns the 5 closest, nearest first (AC 4.4)', () => {
  const near = nearestHomes(homes, 47.6400, -122.3500)
  assert.equal(near.length, 5)
  assert.equal(near[0].home.id, 'a')
  assert.equal(near[1].home.id, 'b')
  for (let i = 1; i < near.length; i++) assert.ok(near[i].meters >= near[i - 1].meters)
})

test('nearestHomes works with fewer than 5 homes', () => {
  assert.equal(nearestHomes(homes.slice(0, 2), 47.64, -122.35).length, 2)
})

test('metersBetween is about right', () => {
  // 0.001 degrees of latitude is about 111 m
  assert.ok(Math.abs(metersBetween(47.64, -122.35, 47.641, -122.35) - 111.3) < 1)
  assert.equal(metersBetween(47.64, -122.35, 47.64, -122.35), 0)
})

test('searchHomes matches every word, in any case (AC 4.5)', () => {
  assert.deepEqual(searchHomes(homes, 'warren').map((h) => h.id), ['a'])
  assert.deepEqual(searchHomes(homes, 'BLOCK 2400').map((h) => h.id).sort(), ['a', 'b'])
  assert.deepEqual(searchHomes(homes, 'nowhere st'), [])
})

test('searchHomes returns nothing for an empty box and caps the list', () => {
  assert.deepEqual(searchHomes(homes, '   '), [])
  assert.equal(searchHomes(homes, 'block', 3).length, 3)
})
