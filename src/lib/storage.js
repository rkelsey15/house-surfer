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

export function removeKey(key) {
  try {
    localStorage.removeItem(key)
  } catch {
    // Ignore.
  }
}
