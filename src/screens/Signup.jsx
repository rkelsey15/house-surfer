import { useState } from 'react'
import Logo from '../components/Logo.jsx'
import ThemeSwitch from '../components/ThemeSwitch.jsx'
import { makeHandleOptions } from '../lib/handles.js'
import { useProfile } from '../lib/ProfileContext.jsx'

// First screen: pick an anonymous handle and read the house rules.
export default function Signup() {
  const { saveProfile } = useProfile()
  const [options, setOptions] = useState(() => makeHandleOptions(3))
  const [picked, setPicked] = useState(options[0])

  function shuffle() {
    const next = makeHandleOptions(3)
    setOptions(next)
    setPicked(next[0])
  }

  return (
    <div className="signup">
      <div className="signup-theme">
        <ThemeSwitch />
      </div>
      <div className="hero">
        <Logo center />
        <h1>Pick your surfer name</h1>
        <p>You stay anonymous. People only ever see this handle.</p>
      </div>

      <div role="radiogroup" aria-label="Surfer name">
        {options.map((handle) => (
          <button
            key={handle}
            role="radio"
            aria-checked={picked === handle}
            className={picked === handle ? 'opt sel' : 'opt'}
            onClick={() => setPicked(handle)}
          >
            {handle}
            <span className="radio" />
          </button>
        ))}
      </div>
      <button className="link-btn" onClick={shuffle}>
        Shuffle names
      </button>

      <h2 className="rules-title">House rules</h2>
      <ul className="rules">
        <li>Talk about the house, never the people in it.</li>
        <li>No names, schedules or plate numbers.</li>
        <li>Every comment and photo is screened before it posts.</li>
      </ul>

      <button className="btn pri full start" onClick={() => saveProfile(picked)}>
        Start surfing
      </button>
    </div>
  )
}
