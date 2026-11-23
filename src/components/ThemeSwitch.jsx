import { useTheme } from '../lib/ThemeContext.jsx'
import { logEvent } from '../lib/events.js'

const OPTIONS = [
  ['system', 'Auto'],
  ['light', 'Light'],
  ['dark', 'Dark'],
]

// Manual light/dark switch. "Auto" follows the device setting.
export default function ThemeSwitch() {
  const { theme, setTheme } = useTheme()
  return (
    <div className="seg" role="radiogroup" aria-label="Color theme">
      {OPTIONS.map(([value, label]) => (
        <button
          key={value}
          role="radio"
          aria-checked={theme === value}
          className={theme === value ? 'on' : ''}
          onClick={() => {
            if (value !== theme) logEvent('theme_changed', { theme: value })
            setTheme(value)
          }}
        >
          {label}
        </button>
      ))}
    </div>
  )
}
