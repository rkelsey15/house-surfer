import { useEffect, useRef, useState } from 'react'
import { useStoredState } from '../lib/useStoredState.js'

const NOTE = 'Demo: sample data, saved only on this device'
const SHRINK_AFTER_MS = 5000

// Small dismissible note: this is a demo. Once closed it stays closed on this
// device (until "Reset demo"). On laptops the floating pill shrinks to an "i"
// button after a few seconds so it stops covering the page; tap it to read the
// note again. It never shrinks while the pointer or keyboard focus is on it.
export default function DemoBanner() {
  const [dismissed, setDismissed] = useStoredState('hs.demoBannerDismissed', false)
  const [compact, setCompact] = useState(false)
  const [busy, setBusy] = useState(false) // pointer or focus is on the note
  const ref = useRef(null)
  const [reopened, setReopened] = useState(false)
  const wide = typeof window !== 'undefined' && window.matchMedia('(min-width: 900px)').matches

  useEffect(() => {
    if (!wide || compact || busy || dismissed) return undefined
    const t = setTimeout(() => setCompact(true), SHRINK_AFTER_MS)
    return () => clearTimeout(t)
  }, [wide, compact, busy, dismissed])

  // After tapping "i", keyboard focus moves into the note (the button it replaced is gone).
  useEffect(() => {
    if (reopened && !compact) {
      ref.current?.querySelector('button')?.focus()
      setReopened(false)
    }
  }, [reopened, compact])

  if (dismissed) return null

  if (compact) {
    return (
      <button
        className="demo-info"
        aria-label={`${NOTE}. Show note`}
        aria-expanded="false"
        onClick={() => {
          setCompact(false)
          setReopened(true)
        }}
      >
        i
      </button>
    )
  }

  return (
    <div
      className="demo-banner"
      role="note"
      ref={ref}
      onMouseEnter={() => setBusy(true)}
      onMouseLeave={() => setBusy(false)}
      onFocus={() => setBusy(true)}
      onBlur={() => setBusy(false)}
    >
      <span>{NOTE}</span>
      <button className="demo-banner-close" aria-label="Close demo note" onClick={() => setDismissed(true)}>
        <span aria-hidden="true">×</span>
      </button>
    </div>
  )
}
