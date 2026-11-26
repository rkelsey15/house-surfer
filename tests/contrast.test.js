// Run with: npm test
// Reads the color tokens from src/styles.css and checks the pairs the app uses,
// in light and dark mode (WCAG 1.4.3 text 4.5:1, 1.4.11 controls and icons 3:1).
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { test } from 'node:test'
import { contrastRatio } from '../src/lib/contrast.js'

const css = readFileSync(new URL('../src/styles.css', import.meta.url), 'utf8')

// The first :root block is light; the `:root[data-theme='dark']` block is dark.
function tokens(startMarker) {
  const start = css.indexOf(startMarker)
  const block = css.slice(css.indexOf('{', start) + 1, css.indexOf('}', start))
  return Object.fromEntries([...block.matchAll(/--([\w-]+):\s*(#[0-9a-fA-F]{3,6})/g)].map((m) => [m[1], m[2]]))
}
const THEMES = { light: tokens(':root {'), dark: tokens(":root[data-theme='dark']") }

// [foreground, background, minimum ratio, what it is]
const TEXT = 4.5
const GRAPHIC = 3
const PAIRS = [
  ['ink', 'bg', TEXT, 'body text'],
  ['ink', 'surface', TEXT, 'text on cards'],
  ['ink', 'brand-soft', TEXT, 'demo banner, stats pill'],
  ['muted', 'bg', TEXT, 'secondary text on page'],
  ['muted', 'surface', TEXT, 'secondary text on cards'],
  ['muted', 'brand-soft', TEXT, 'close button on banner'],
  ['brand', 'bg', TEXT, 'links and active tab on page'],
  ['brand', 'surface', TEXT, 'links on cards'],
  ['brand', 'brand-soft', TEXT, 'chips, sample tag'],
  ['on-brand', 'brand', TEXT, 'primary buttons'],
  ['danger', 'coral-soft', TEXT, 'karma pill and blocked-comment message'],
  ['on-danger', 'danger', TEXT, 'reset button'],
  ['gold-text', 'surface', TEXT, 'star scores on cards'],
  ['gold-text', 'bg', TEXT, 'star scores on page'],
  ['gold', 'surface', GRAPHIC, 'filled stars on cards'],
  ['gold', 'bg', GRAPHIC, 'filled stars on page'],
  ['muted', 'bg', GRAPHIC, 'empty star outlines'],
  ['control-line', 'surface', GRAPHIC, 'input and button borders on cards'],
  ['control-line', 'bg', GRAPHIC, 'input and button borders on page'],
  ['brand', 'bg', GRAPHIC, 'focus ring on page'],
  ['b-green', 'b-green-soft', GRAPHIC, 'green badge icon on its tint'],
  ['b-green', 'surface', GRAPHIC, 'green badge icon on the card (locked, softer tint)'],
  ['b-blue', 'b-blue-soft', GRAPHIC, 'blue badge icon on its tint'],
  ['b-blue', 'surface', GRAPHIC, 'blue badge icon on the card (locked, softer tint)'],
  ['b-purple', 'b-purple-soft', GRAPHIC, 'purple badge icon on its tint'],
  ['b-purple', 'surface', GRAPHIC, 'purple badge icon on the card (locked, softer tint)'],
  ['b-coral', 'b-coral-soft', GRAPHIC, 'coral badge icon on its tint'],
  ['b-coral', 'surface', GRAPHIC, 'coral badge icon on the card (locked, softer tint)'],
  ['b-amber', 'b-amber-soft', GRAPHIC, 'amber badge icon on its tint'],
  ['b-amber', 'surface', GRAPHIC, 'amber badge icon on the card (locked, softer tint)'],
  ['elite-gold', 'elite-bg', TEXT, 'Surfer Elite icon on black'],
  ['ink', 'gold-soft', TEXT, 'text on gold'],
  ['brand', 'surface', GRAPHIC, 'focus ring on cards'],
]

for (const [theme, t] of Object.entries(THEMES)) {
  for (const [fg, bg, min, what] of PAIRS) {
    test(`${theme}: ${what} (${fg} on ${bg}) is at least ${min}:1`, () => {
      assert.ok(t[fg] && t[bg], `missing token ${fg} or ${bg}`)
      const ratio = contrastRatio(t[fg], t[bg])
      assert.ok(ratio >= min, `${ratio.toFixed(2)}:1 (${t[fg]} on ${t[bg]})`)
    })
  }
}
