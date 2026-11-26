import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useGuide } from '../lib/GuideContext.jsx'
import { resetDemo } from '../lib/demo.js'

// The one Demo control: a small round "i" button floating bottom-left on every screen.
// Tap it for a small panel: "Try this guide" and "Start over" (asks first).
// Esc or a tap outside closes the panel and puts focus back on the button.
export default function DemoMenu({ withGuide = true }) {
  const [open, setOpen] = useState(false)
  const [confirming, setConfirming] = useState(false)
  const btnRef = useRef(null)
  const panelRef = useRef(null)
  const guide = useGuide()
  const navigate = useNavigate()

  const close = (returnFocus = true) => {
    setOpen(false)
    setConfirming(false)
    if (returnFocus) btnRef.current?.focus()
  }

  useEffect(() => {
    if (!open) return undefined
    const onKey = (e) => {
      if (e.key === 'Escape') close()
    }
    const onDown = (e) => {
      if (panelRef.current?.contains(e.target) || btnRef.current?.contains(e.target)) return
      close(false)
    }
    document.addEventListener('keydown', onKey)
    document.addEventListener('pointerdown', onDown)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.removeEventListener('pointerdown', onDown)
    }
  }, [open])

  // Move focus into the panel when it opens.
  useEffect(() => {
    if (open) panelRef.current?.querySelector('button')?.focus()
  }, [open, confirming])

  return (
    <div className="demo-menu">
      {open && (
        <div className="demo-panel" id="demo-panel" role="dialog" aria-label="Demo controls" ref={panelRef}>
          <p className="demo-panel-t">Demo: sample data, saved only on this device</p>
          {confirming ? (
            <div role="alertdialog" aria-label="Reset demo">
              <p className="demo-panel-q">Clear all your demo data on this device?</p>
              <div className="demo-panel-row">
                <button className="btn" onClick={() => setConfirming(false)}>Cancel</button>
                <button className="btn danger" onClick={resetDemo}>Yes, reset</button>
              </div>
            </div>
          ) : (
            <div className="demo-panel-row">
              {withGuide && (
                <button
                  className="btn"
                  onClick={() => {
                    guide?.reopen()
                    close(false)
                    navigate('/')
                  }}
                >
                  Try this guide
                </button>
              )}
              <button className="btn" onClick={() => setConfirming(true)}>Start over</button>
            </div>
          )}
        </div>
      )}
      <button
        ref={btnRef}
        className="demo-info"
        aria-label="Demo"
        aria-expanded={open}
        aria-controls="demo-panel"
        onClick={() => (open ? close() : setOpen(true))}
      >
        i
      </button>
    </div>
  )
}
