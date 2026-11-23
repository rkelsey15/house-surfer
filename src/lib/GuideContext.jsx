import { createContext, useCallback, useContext, useMemo } from 'react'
import { useStoredState } from './useStoredState.js'

// The "Try this" checklist for first-time visitors, saved under "hs.guide".
// Shape: { dismissed: boolean, done: { rate3, comment, moderation, map } }
const GuideContext = createContext(null)

export const GUIDE_ITEMS = [
  { key: 'rate3', label: 'Rate 3 homes' },
  { key: 'comment', label: 'Open a home and comment' },
  { key: 'moderation', label: 'Try writing about a neighbor to see moderation', hint: 'Try writing "The neighbors are loud"' },
  { key: 'map', label: 'View the map' },
]

const INITIAL = { dismissed: false, done: {} }

export function GuideProvider({ children }) {
  const [guide, setGuide] = useStoredState('hs.guide', INITIAL)

  // Checkmarks only ever turn on (deleting a comment later doesn't undo it).
  const markDone = useCallback(
    (key) => {
      setGuide((prev) => (prev.done?.[key] ? prev : { ...prev, done: { ...prev.done, [key]: true } }))
    },
    [setGuide],
  )
  const dismiss = useCallback(() => setGuide((prev) => ({ ...prev, dismissed: true })), [setGuide])
  const reopen = useCallback(() => setGuide((prev) => ({ ...prev, dismissed: false })), [setGuide])

  const value = useMemo(() => {
    const done = guide.done ?? {}
    const doneCount = GUIDE_ITEMS.filter((i) => done[i.key]).length
    return { dismissed: !!guide.dismissed, done, doneCount, total: GUIDE_ITEMS.length, markDone, dismiss, reopen }
  }, [guide, markDone, dismiss, reopen])

  return <GuideContext.Provider value={value}>{children}</GuideContext.Provider>
}

export const useGuide = () => useContext(GuideContext)
