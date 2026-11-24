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
