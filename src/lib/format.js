// Small helpers for showing a home. Addresses in homes.json are already
// block-level ("2400 block of Warren Ave N"), so we never show more than that.

const trimZeros = (n) => String(Number(n.toFixed(2)))

export function factsLine(home) {
  const parts = []
  if (home.beds) parts.push(`${home.beds} bd`)
  if (home.baths) parts.push(`${trimZeros(home.baths)} ba`)
  if (home.sqft) parts.push(`${home.sqft.toLocaleString('en-US')} sq ft`)
  if (home.yearBuilt) parts.push(`built ${home.yearBuilt}`)
  return parts.join(' · ')
}

// "Duplex · Craftsman era", used as the small label under the address.
export function typeLine(home) {
  return home.type === 'Single-family' ? home.style : `${home.type} · ${home.style}`
}
