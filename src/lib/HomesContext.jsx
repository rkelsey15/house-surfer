import { createContext, useContext, useEffect, useState } from 'react'
import { showTownhouses } from '../config.js'

// Loads public/data/homes.json once and shares it with every screen.
// This is the ONE place the showTownhouses flag is applied, so every list,
// feed, map and photo-match picks from the same set of homes.
const HomesContext = createContext({ homes: [], status: 'loading' })

export function HomesProvider({ children }) {
  const [state, setState] = useState({ homes: [], status: 'loading' })

  useEffect(() => {
    let cancelled = false
    fetch(`${import.meta.env.BASE_URL}data/homes.json`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        return res.json()
      })
      .then((all) => {
        if (cancelled) return
        const homes = showTownhouses ? all : all.filter((h) => h.type !== 'Townhouse')
        setState({ homes, status: 'ready' })
      })
      .catch((err) => {
        if (!cancelled) setState({ homes: [], status: 'error', error: err.message })
      })
    return () => {
      cancelled = true
    }
  }, [])

  return <HomesContext.Provider value={state}>{children}</HomesContext.Provider>
}

export const useHomes = () => useContext(HomesContext)
