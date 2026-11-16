import { useCallback, useState } from 'react'
import { readJSON, writeJSON } from './storage.js'

// Like useState, but the value is also saved in localStorage under `key`.
export function useStoredState(key, initial) {
  const [value, setValue] = useState(() => readJSON(key, initial))
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
