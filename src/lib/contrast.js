// WCAG contrast maths, used by the contrast test (tests/contrast.test.js).
// Text needs 4.5:1; borders and icons that carry meaning need 3:1.

const toLinear = (v) => {
  const c = v / 255
  return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
}

// "#rrggbb" or "#rgb" -> [r, g, b]
export function parseHex(hex) {
  let h = hex.replace('#', '').trim()
  if (h.length === 3) h = h.split('').map((x) => x + x).join('')
  return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16))
}

export const luminance = (hex) => {
  const [r, g, b] = parseHex(hex).map(toLinear)
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

export function contrastRatio(a, b) {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x)
  return (hi + 0.05) / (lo + 0.05)
}
