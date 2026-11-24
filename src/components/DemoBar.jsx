import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useGuide } from '../lib/GuideContext.jsx'
import { resetDemo } from '../lib/demo.js'

// Demo controls at the top of Profile: reopen the "Try this" guide, or start over.
// A slim bar on laptops, a compact row on phones (same markup, CSS decides).
// "Start over" never clears anything until you confirm.
export default function DemoBar() {
  const [confirming, setConfirming] = useState(false)
  const { reopen } = useGuide()
  const navigate = useNavigate()

  return (
    <section className="demobar" aria-label="Demo controls">
      <span className="demobar-label">Demo</span>
      {confirming ? (
        <div className="demobar-confirm" role="alertdialog" aria-label="Reset demo">
          <span>Clear all your demo data on this device?</span>
          <button className="btn" onClick={() => setConfirming(false)}>Cancel</button>
          <button className="btn danger" onClick={resetDemo}>Yes, reset</button>
        </div>
      ) : (
        <div className="demobar-actions">
          <button
            className="btn"
            onClick={() => {
              reopen()
              navigate('/')
            }}
          >
            Try this guide
          </button>
          <button className="btn" onClick={() => setConfirming(true)}>Start over</button>
        </div>
      )}
    </section>
  )
}
