import { createContext, useCallback, useContext, useMemo } from 'react'
import { useStoredState } from './useStoredState.js'

// Your star ratings, saved in the browser under "hs.ratings".
// Shape: { [homeId]: { stars: 1-5, at: ISO date } }
// Rerating a home replaces the old rating (it never counts twice).
const RatingsContext = createContext(null)

export const KARMA_PER_RATING = 5

export function RatingsProvider({ children }) {
  const [ratings, setRatings] = useStoredState('hs.ratings', {})

  const rate = useCallback(
    (homeId, stars) => {
      setRatings((prev) => ({ ...prev, [homeId]: { stars, at: new Date().toISOString() } }))
    },
    [setRatings],
  )

  const value = useMemo(() => {
    const count = Object.keys(ratings).length
    return { ratings, rate, count, karmaFromRatings: count * KARMA_PER_RATING }
  }, [ratings, rate])

  return <RatingsContext.Provider value={value}>{children}</RatingsContext.Provider>
}

export const useRatings = () => useContext(RatingsContext)
