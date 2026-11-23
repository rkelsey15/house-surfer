import { useStoredState } from '../lib/useStoredState.js'

// Small dismissible note at the top of the page: this is a demo.
// Once closed it stays closed on this device (until "Reset demo").
export default function DemoBanner() {
  const [dismissed, setDismissed] = useStoredState('hs.demoBannerDismissed', false)
  if (dismissed) return null
  return (
    <div className="demo-banner" role="note">
      <span>Demo: sample data, saved only on this device</span>
      <button className="demo-banner-close" aria-label="Close demo note" onClick={() => setDismissed(true)}>
        ×
      </button>
    </div>
  )
}
