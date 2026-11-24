import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useGuide } from '../lib/GuideContext.jsx'
import ThemeSwitch from '../components/ThemeSwitch.jsx'
import { HouseIcon, LockIcon } from '../components/Icons.jsx'
import { useProfile } from '../lib/ProfileContext.jsx'
import { useComments } from '../lib/CommentsContext.jsx'
import { useRatings } from '../lib/RatingsContext.jsx'
import { EmptyState } from '../components/MoodImage.jsx'
import { MOOD_PHOTOS, PEXELS_LICENSE_URL } from '../lib/credits.js'
import { useHomes } from '../lib/HomesContext.jsx'
import { usePhotos } from '../lib/PhotosContext.jsx'
import { LOCKED_BADGES, myComments, recentActivity } from '../lib/profileLists.js'
import { ActivityRow, CommentRow } from '../components/ProfileRows.jsx'

// Profile shows only the latest few of each list; "See all" opens the full page.
const PREVIEW = 5

import { resetDemo } from '../lib/demo.js'

const monthYear = (iso) => new Date(iso).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })

// Shell version of the profile. Karma, homes rated, comments, activity and
// badges are filled in during later steps.
export default function Profile() {
  const { profile } = useProfile()
  const { count, karmaFromRatings } = useRatings()
  const { comments, likes, count: commentCount, karmaFromComments } = useComments()
  const { ratings } = useRatings()
  const { photos } = usePhotos()
  const { homes } = useHomes()
  const homeById = useMemo(() => new Map(homes.map((h) => [h.id, h])), [homes])
  const mine = useMemo(() => myComments(comments, profile.handle), [comments, profile.handle])
  const activity = useMemo(
    () => recentActivity({ ratings, comments, likes, photos, me: profile.handle, limit: Infinity }),
    [ratings, comments, likes, photos, profile.handle],
  )
  const [confirming, setConfirming] = useState(false)
  const { reopen } = useGuide()
  const navigate = useNavigate()

  return (
    <div>
      <div className="avatar">
        <HouseIcon />
      </div>
      <h1 className="handle">{profile.handle}</h1>
      <div className="anon">Anonymous · surfing Queen Anne since {monthYear(profile.joined)}</div>

      <div className="stats">
        <div className="stat"><b>{karmaFromRatings + karmaFromComments}</b><span>karma</span></div>
        <div className="stat"><b>{count}</b><span>homes rated</span></div>
        <div className="stat"><b>{commentCount}</b><span>comments</span></div>
      </div>

      <div className="profile-cols">
        <div className="profile-col">
          <section className="profile-sec">
            <h2 className="sec-t">My comments</h2>
            {mine.length === 0 ? (
              <EmptyState photo={MOOD_PHOTOS.sidewalk} position="50% 55%" title="No comments yet">
                <p className="muted">
                  <Link to="/">Surf the feed</Link> and say something about a house.
                </p>
              </EmptyState>
            ) : (
              <>
                <ul className="plist">
                  {mine.slice(0, PREVIEW).map((c) => (
                    <CommentRow key={c.id} c={c} homeById={homeById} />
                  ))}
                </ul>
                {mine.length > PREVIEW && (
                  <Link className="btn full" to="/profile/comments">See all {mine.length} comments</Link>
                )}
              </>
            )}
          </section>

          <section className="profile-sec">
            <h2 className="sec-t">Recent activity</h2>
            {activity.length === 0 ? (
              <p className="muted center note">Rate, comment, like or snap a house and it shows up here.</p>
            ) : (
              <>
                <ul className="plist">
                  {activity.slice(0, PREVIEW).map((a) => (
                    <ActivityRow key={a.key} a={a} homeById={homeById} />
                  ))}
                </ul>
                {activity.length > PREVIEW && (
                  <Link className="btn full" to="/profile/activity">See all activity</Link>
                )}
              </>
            )}
          </section>
        </div>

        <div className="profile-col">
          <section className="profile-sec">
            <h2 className="sec-t">Badges</h2>
            <p className="muted small">Coming soon. No badge unlocks in the demo.</p>
            <ul className="badge-grid plist">
              {LOCKED_BADGES.map((b) => (
                <li key={b.id} className="badge-lock">
                  <LockIcon />
                  <span className="sr-only">Locked: </span>
                  <b>{b.name}</b>
                  <span>{b.how}</span>
                  <span className="soon">Coming soon</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="profile-sec">
            <h2 className="sec-t">Settings</h2>
            <div className="setting setting-stack">
              <span id="appearance-label">Appearance</span>
              <ThemeSwitch labelledBy="appearance-label" />
            </div>
            <p className="muted small">Auto follows your device's light or dark setting.</p>
            <div className="setting">
              <span>Surfer name</span>
              <span className="muted small">{profile.handle} · locked</span>
            </div>
            <div className="setting">
              <span>Product numbers</span>
              <Link className="btn" to="/stats">View stats</Link>
            </div>
          </section>
        </div>
      </div>

      <section className="profile-sec">
        <h2 className="sec-t">Credits</h2>
        <ul className="credits">
          {Object.values(MOOD_PHOTOS).map((p) => (
            <li key={p.file}>
              <span>
                Photo: <a href={p.pageUrl} target="_blank" rel="noreferrer">{p.title}</a> by{' '}
                <a href={p.photographerUrl} target="_blank" rel="noreferrer">{p.photographer}</a> on {p.source}
              </span>
            </li>
          ))}
          <li>
            <span>
              The photos set the mood only; they are never shown on a real home. They are free to use under the{' '}
              <a href={PEXELS_LICENSE_URL} target="_blank" rel="noreferrer">Pexels license</a>.
            </span>
          </li>
          <li>
            <span>Homes: King County public records. Map: &copy; OpenStreetMap contributors. House drawings are made in code.</span>
          </li>
        </ul>
      </section>

      <section className="profile-sec">
        <h2 className="sec-t demo-sec">Demo</h2>
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
      </section>
    </div>
  )
}
