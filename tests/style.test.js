// Run with: npm test
// Guards the look: one corner-radius scale and one icon line weight.
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { test } from 'node:test'

const css = readFileSync(new URL('../src/styles.css', import.meta.url), 'utf8')
const icons = readFileSync(new URL('../src/components/Icons.jsx', import.meta.url), 'utf8')

test('corner radius uses the scale (small, control, card) or a circle or pill', () => {
  const loose = [...css.matchAll(/border-radius:\s*([^;}]+)/g)]
    .map((m) => m[1].trim())
    .filter((v) => !/^(var\(--r-(sm|ctl|card)\)|50%|999px)$/.test(v))
  // The logo mark keeps its original 8 px (the logo is unchanged).
  assert.deepEqual([...new Set(loose)], ['8px'])
})

test('every icon is drawn with a 2 px line (the check mark is 3 px for legibility)', () => {
  const widths = [...icons.matchAll(/strokeWidth[:=]\s*\{?\s*([\d.]+)/g)].map((m) => m[1])
  assert.ok(widths.length >= 1)
  assert.ok(widths.every((w) => w === '2' || w === '3'), widths.join(','))
})

test('there are three button styles: primary, secondary (default) and quiet', () => {
  assert.match(css, /\.btn\.pri \{/)
  assert.match(css, /\.btn\.quiet \{/)
  assert.match(css, /\n\.btn \{/)
})
