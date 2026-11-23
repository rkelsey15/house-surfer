import { readJSON, writeJSON } from './storage.js'

// Event log, saved in the browser under "hs.events". It feeds the /stats page.
// Each event is { name, at, handle, ...fields }. Fields never hold comment
// text, photos or location.
const KEY = 'hs.events'
const MAX_EVENTS = 2000

export function logEvent(name, fields = {}) {
  try {
    const handle = readJSON('hs.profile', null)?.handle ?? null
    const events = readJSON(KEY, [])
    events.push({ name, at: new Date().toISOString(), handle, ...fields })
    writeJSON(KEY, events.slice(-MAX_EVENTS))
  } catch {
    // Logging must never break the app.
  }
}

export const readEvents = () => readJSON(KEY, [])
