import ThemeSwitch from '../components/ThemeSwitch.jsx'
import { HouseFillIcon } from '../components/Icons.jsx'
import { useProfile } from '../lib/ProfileContext.jsx'
import { useComments } from '../lib/CommentsContext.jsx'
import { useRatings } from '../lib/RatingsContext.jsx'

const monthYear = (iso) => new Date(iso).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })

// Shell version of the profile. Karma, homes rated, comments, activity and
// badges are filled in during later steps.
export default function Profile() {
  const { profile } = useProfile()
  const { count, karmaFromRatings } = useRatings()
  const { count: commentCount, karmaFromComments } = useComments()

  return (
    <div>
      <div className="avatar">
        <HouseFillIcon />
      </div>
      <div className="handle">{profile.handle}</div>
      <div className="anon">Anonymous · surfing Queen Anne since {monthYear(profile.joined)}</div>

      <div className="stats">
        <div className="stat"><b>{karmaFromRatings + karmaFromComments}</b><span>karma</span></div>
        <div className="stat"><b>{count}</b><span>homes rated</span></div>
        <div className="stat"><b>{commentCount}</b><span>comments</span></div>
      </div>

      <h2 className="sec-t">Settings</h2>
      <div className="setting">
        <span>Theme</span>
        <ThemeSwitch />
      </div>
      <div className="setting">
        <span>Surfer name</span>
        <span className="muted small">{profile.handle} · locked</span>
      </div>

      <h2 className="sec-t">Demo</h2>
      <div className="setting">
        <span>Start over</span>
        <button className="btn" onClick={() => {}}>
          Reset demo
        </button>
      </div>
    </div>
  )
}
