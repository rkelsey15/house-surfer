import { useCallback, useState } from 'react'
import { readJSON, writeJSON } from './storage.js'

// Like useState, but the value is also saved in localStorage under `key`.
// `migrate` (optional) converts older saved data to the current shape on load.
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
