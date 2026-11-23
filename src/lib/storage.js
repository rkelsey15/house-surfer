// Safe wrappers around localStorage. Storage can be blocked (private windows,
// browser settings), so every read and write is wrapped and the app keeps
// working without it.
//
// All House Surfer keys start with "hs." and hold JSON.

export function readJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    return raw === null ? fallback : JSON.parse(raw)
  } catch {
    return fallback
  }
}

export function writeJSON(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // Ignore: storage is full or blocked.
  }
}

// Remove every key House Surfer owns ("hs." prefix) and nothing else.
export function clearAllData() {
  try {
    const mine = []
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key && key.startsWith('hs.')) mine.push(key)
    }
    mine.forEach((key) => localStorage.removeItem(key))
  } catch {
    // Ignore.
  }
}

export function removeKey(key) {
  try {
    localStorage.removeItem(key)
  } catch {
    // Ignore.
  }
}
