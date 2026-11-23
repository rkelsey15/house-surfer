import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useGuide } from '../lib/GuideContext.jsx'
import ThemeSwitch from '../components/ThemeSwitch.jsx'
import { HouseFillIcon } from '../components/Icons.jsx'
import { useProfile } from '../lib/ProfileContext.jsx'
import { useComments } from '../lib/CommentsContext.jsx'
import { useRatings } from '../lib/RatingsContext.jsx'
import { useHomes } from '../lib/HomesContext.jsx'
import { myComments } from '../lib/profileLists.js'
import { resetDemo } from '../lib/demo.js'

const monthYear = (iso) => new Date(iso).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })

// Shell version of the profile. Karma, homes rated, comments, activity and
// badges are filled in during later steps.
export default function Profile() {
  const { profile } = useProfile()
  const { count, karmaFromRatings } = useRatings()
  const { comments, count: commentCount, karmaFromComments } = useComments()
  const { homes } = useHomes()
  const homeById = useMemo(() => new Map(homes.map((h) => [h.id, h])), [homes])
  const mine = useMemo(() => myComments(comments, profile.handle), [comments, profile.handle])
  const [confirming, setConfirming] = useState(false)
  const { reopen } = useGuide()
  const navigate = useNavigate()

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

      <h2 className="sec-t">My comments</h2>
      {mine.length === 0 ? (
        <p className="muted center note">
          You haven't left a comment yet. <Link to="/">Surf the feed</Link> and say something about a house.
        </p>
      ) : (
        <ul className="plist">
          {mine.map((c) => (
            <li key={c.id}>
              <Link to={'/home/' + c.home_id} className="pitem">
                <span className="addr">{homeById.get(c.home_id)?.address ?? 'A home'}</span>
                <span className="pbody">{c.body}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}

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
        <span>Try this guide</span>
        <button
          className="btn"
          onClick={() => {
            reopen()
            navigate('/')
          }}
        >
          Show Try this guide
        </button>
      </div>
      <div className="setting">
        <span>Start over</span>
        {!confirming && (
          <button className="btn" onClick={() => setConfirming(true)}>
            Reset demo
          </button>
        )}
      </div>
      {confirming && (
        <div className="reset-confirm" role="alertdialog" aria-label="Reset demo">
          <p>Clear all your demo data on this device?</p>
          <div className="reset-actions">
            <button className="btn" onClick={() => setConfirming(false)}>
              Cancel
            </button>
            <button className="btn danger" onClick={resetDemo}>
              Yes, reset
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
