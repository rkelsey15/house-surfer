// Anonymous handle generator, e.g. "CedarSurfer42". Made of house-and-nature
// words so it can never look like a real person's name.
const FIRST = [
  'Cedar', 'Gable', 'Porch', 'Mossy', 'Brick', 'Maple', 'Dormer', 'Shingle',
  'Ivy', 'Fern', 'Slate', 'Timber', 'Lantern', 'Hearth', 'Cobble', 'Willow',
  'Chimney', 'Garden', 'Pebble', 'Copper',
]
const SECOND = ['Surfer', 'Gazer', 'Perch', 'Roof', 'Stoop', 'Scout', 'Spotter', 'Walker', 'Watcher']

const pick = (list) => list[Math.floor(Math.random() * list.length)]

export function makeHandle() {
  return `${pick(FIRST)}${pick(SECOND)}${Math.floor(Math.random() * 99) + 1}`
}

// Returns `count` different handles to choose from.
export function makeHandleOptions(count = 3) {
  const set = new Set()
  while (set.size < count) set.add(makeHandle())
  return [...set]
}
