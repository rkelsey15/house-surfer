import { useEffect, useId, useRef, useState } from 'react'
import { AVATARS, DEFAULT_AVATAR, avatarName, cleanAvatar } from '../lib/avatars.js'
import { useStoredState } from '../lib/useStoredState.js'
import { HouseIcon, PencilIcon } from './Icons.jsx'

// Colors come from the avatar's CSS tokens (see AVATARS), so the picture follows light and dark.
const colors = (a) => ({ '--av-fg': `var(${a.fg})`, '--av-bg': `var(${a.bg})` })

// The profile picture. Tap it to open eight built-in choices; the pick is saved in `hs.avatar`.
// Esc closes the choices and puts focus back on the picture.
export default function Avatar() {
  const [saved, setSaved] = useStoredState('hs.avatar', DEFAULT_AVATAR, cleanAvatar)
  const [open, setOpen] = useState(false)
  const btnRef = useRef(null)
  const panelId = useId()
  const current = AVATARS.find((a) => a.id === saved) ?? AVATARS[0]

  useEffect(() => {
    if (!open) return undefined
    const onKey = (e) => {
      if (e.key === 'Escape') {
        setOpen(false)
        btnRef.current?.focus()
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open])

  const pick = (id) => {
    setSaved(id)
    setOpen(false)
    btnRef.current?.focus()
  }

  return (
    <div className="avatar-wrap">
      <button
        ref={btnRef}
        className="avatar avatar-btn"
        style={colors(current)}
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={`Profile picture: ${avatarName(saved)}. Change it`}
        onClick={() => setOpen((o) => !o)}
      >
        <HouseIcon />
        <span className="avatar-edit" aria-hidden="true">
          <PencilIcon />
        </span>
      </button>
      <div className="avatar-choices" id={panelId} role="group" aria-label="Choose a profile picture" hidden={!open}>
        {AVATARS.map((a) => (
          <button key={a.id} className="avatar-opt" style={colors(a)} aria-pressed={a.id === saved} aria-label={avatarName(a.id)} onClick={() => pick(a.id)}>
            <HouseIcon />
          </button>
        ))}
      </div>
    </div>
  )
}
