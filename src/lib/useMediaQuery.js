import { useEffect, useState } from 'react'

// True while the browser window matches a media query, and updates when it changes
// (for example turning a phone sideways or resizing a laptop window).
export function useMediaQuery(query) {
  const get = () => typeof window !== 'undefined' && window.matchMedia(query).matches
  const [matches, setMatches] = useState(get)
  useEffect(() => {
    const mq = window.matchMedia(query)
    const onChange = () => setMatches(mq.matches)
    onChange()
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [query])
  return matches
}

// The laptop layout of the Surf screen starts here (the Try this panel moves beside the card).
export const LAPTOP_QUERY = '(min-width: 1024px)'
