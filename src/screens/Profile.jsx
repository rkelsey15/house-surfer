import ThemeSwitch from '../components/ThemeSwitch.jsx'
import { HouseFillIcon } from '../components/Icons.jsx'
import { useProfile } from '../lib/ProfileContext.jsx'

const monthYear = (iso) => new Date(iso).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })

// Shell version of the profile. Karma, homes rated, takes, activity and
// badges are filled in during later steps.
export default function Profile() {
  const { profile, clearProfile } = useProfile()

  return (
    <div>
      <div className="avatar">
        <HouseFillIcon />
      </div>
      <div className="handle">{profile.handle}</div>
      <div className="anon">Anonymous · surfing Queen Anne since {monthYear(profile.joined)}</div>

      <div className="stats">
        <div className="stat"><b>0</b><span>karma</span></div>
        <div className="stat"><b>0</b><span>homes rated</span></div>
        <div className="stat"><b>0</b><span>takes</span></div>
      </div>

      <h2 className="sec-t">Settings</h2>
      <div className="setting">
        <span>Theme</span>
        <ThemeSwitch />
      </div>
      <div className="setting">
        <span>Surfer name</span>
        <button className="btn" onClick={clearProfile}>
          Change name
        </button>
      </div>
    </div>
  )
}
