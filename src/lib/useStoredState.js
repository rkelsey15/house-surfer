import { useCallback, useState } from 'react'
import { readJSON, writeJSON } from './storage.js'

// Like useState, but the value is also saved in localStorage under `key`.
// `migrate` (optional) converts older saved data to the current shape on load.
//
// Things to know before you reuse or change this:
//  - It reads storage ONCE, when the component first renders. If another tab changes
//    the same key, this tab does not notice (fine for a single-player demo).
//  - It writes inside the state updater so the saved value is always the newest one,
//    even when several updates are queued. React may run an updater twice in dev
//    (StrictMode), so the write is harmless to repeat, but NEVER put other side
//    effects (like logging an event) inside the function you pass to `set`.
//  - If storage is blocked or full, the app keeps working in memory (see storage.js).
export function useStoredState(key, initial, migrate) {
  const [value, setValue] = useState(() => {
    const saved = readJSON(key, initial)
    return migrate ? migrate(saved) : saved
  })
  const set = useCallback(
    (next) => {
      setValue((prev) => {
        const v = typeof next === 'function' ? next(prev) : next
        writeJSON(key, v)
        return v
      })
    },
    [key],
  )
  return [value, set]
}
