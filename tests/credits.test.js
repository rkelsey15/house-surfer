// Run with: npm test
import assert from 'node:assert/strict'
import { existsSync, readFileSync, statSync } from 'node:fs'
import { test } from 'node:test'
import { MOOD_PHOTOS, creditLine } from '../src/lib/credits.js'
import { parseCovers } from '../src/lib/sampleCovers.js'

const pub = (p) => new URL('../public/' + p, import.meta.url)

test('every stock photo exists, is small, and credits its photographer with links', () => {
  const photos = Object.values(MOOD_PHOTOS)
  assert.ok(photos.length >= 2 && photos.length <= 3)
  for (const p of photos) {
    assert.ok(existsSync(pub(p.file)), p.file + ' exists')
    assert.ok(statSync(pub(p.file)).size < 300 * 1024, p.file + ' is under 300 KB')
    assert.ok(p.photographer && p.title)
    assert.match(p.pageUrl, /^https:\/\/www\.pexels\.com\/photo\//)
    assert.match(p.photographerUrl, /^https:\/\/www\.pexels\.com\/@/)
    assert.ok(creditLine(p).includes(p.photographer))
    assert.ok(p.file.startsWith('images/mood/'), 'stock photos live in images/mood/ only')
  }
})

test('sample covers: valid entries become urls; odd ones are skipped', () => {
  const m = parseCovers(
    {
      abc: { file: 'abc.jpg' },
      d: { file: 'porch.WEBP' },
      bad1: { file: '../secret.jpg' },
      bad2: { file: 'sub/dir.jpg' },
      bad3: { file: 'notes.txt' },
      bad4: {},
      bad5: null,
    },
    '/house-surfer/',
  )
  assert.deepEqual([...m.keys()].sort(), ['abc', 'd'])
  assert.equal(m.get('abc'), '/house-surfer/images/homes/abc.jpg')
  assert.equal(parseCovers(null).size, 0)
  assert.equal(parseCovers([1, 2]).size, 0)
})

test('the shipped covers.json is valid and starts empty', () => {
  const json = JSON.parse(readFileSync(pub('images/homes/covers.json'), 'utf8'))
  assert.deepEqual(json, {})
})

// ---------- Part F: sample photos on about 1 home in 3 ----------
import { SAMPLE_PHOTOS } from '../src/lib/credits.js'
import { chooseCover, isStockEligible, stockPhotoFor } from '../src/lib/stockCovers.js'

test('sample photos: about 20 files, each small, credited and linked', () => {
  assert.ok(SAMPLE_PHOTOS.length >= 18 && SAMPLE_PHOTOS.length <= 22)
  const ids = new Set()
  for (const p of SAMPLE_PHOTOS) {
    assert.ok(!ids.has(p.id), 'no duplicates')
    ids.add(p.id)
    assert.ok(existsSync(pub(p.file)), p.file + ' exists')
    assert.ok(statSync(pub(p.file)).size < 200 * 1024, p.file + ' is under 200 KB')
    assert.ok(p.file.startsWith('images/sample/') && p.file.endsWith('.webp'))
    assert.ok(p.photographer && p.title)
    assert.match(p.pageUrl, /^https:\/\/www\.pexels\.com\/photo\//)
    assert.match(p.photographerUrl, /^https:\/\/www\.pexels\.com\/@/)
  }
})

test('about 1 single-family home in 3 gets a sample photo, the same one every time', () => {
  const list = JSON.parse(readFileSync(pub('data/homes.json'), 'utf8')).filter(isStockEligible)
  let hits = 0
  const used = new Set()
  for (const h of list) {
    const a = chooseCover({ homeId: h.id, home: h })
    assert.deepEqual(chooseCover({ homeId: h.id, home: h }), a, 'same home, same photo')
    if (a) {
      hits++
      used.add(a.photo.id)
    }
  }
  const share = hits / list.length
  assert.ok(share > 0.3 && share < 0.37, 'share is ' + share)
  assert.equal(used.size, SAMPLE_PHOTOS.length, 'every photo gets used')
})

test('duplexes and triplexes never get a one-house stock photo', () => {
  const multi = JSON.parse(readFileSync(pub('data/homes.json'), 'utf8')).filter((h) => h.units > 1)
  assert.ok(multi.length > 100)
  for (const h of multi) assert.equal(chooseCover({ homeId: h.id, home: h }), null)
})

test('real photos always win over a sample photo', () => {
  const list = JSON.parse(readFileSync(pub('data/homes.json'), 'utf8')).filter(isStockEligible)
  const stock = list.find((h) => stockPhotoFor(h.id))
  const plain = list.find((h) => !stockPhotoFor(h.id))
  const c = (extra, h = stock) => chooseCover({ homeId: h.id, home: h, ...extra })
  assert.equal(c({}).kind, 'stock')
  assert.equal(c({}, plain), null)
  assert.equal(c({ sample: '/x.jpg' }).kind, 'sample')
  assert.equal(c({ sample: '/x.jpg', mine: 'blob:1' }).kind, 'yours')
  assert.equal(c({ mine: 'blob:1' }).url, 'blob:1')
})
