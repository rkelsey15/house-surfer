import { useMemo } from 'react'
import { Link, useLocation } from 'react-router-dom'
import Badge from '../components/Badge.jsx'
import ThemeSwitch from '../components/ThemeSwitch.jsx'
import { HouseIcon } from '../components/Icons.jsx'
import { useProfile } from '../lib/ProfileContext.jsx'
import { useComments } from '../lib/CommentsContext.jsx'
import { useRatings } from '../lib/RatingsContext.jsx'
import { EmptyState } from '../components/MoodImage.jsx'
import { MOOD_PHOTOS, PEXELS_LICENSE_URL } from '../lib/credits.js'
import { useHomes } from '../lib/HomesContext.jsx'
import { usePhotos } from '../lib/PhotosContext.jsx'
import { BADGES, myComments, recentActivity } from '../lib/profileLists.js'
import { ActivityRow, CommentRow } from '../components/ProfileRows.jsx'

// Profile shows only the latest few of each list; "See all" opens the full page.
const PREVIEW = 5


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
  // Design preview only: #/profile?badges=earned shows the earned look. Nothing is earned in the demo.
  const previewEarned = new URLSearchParams(useLocation().search).get('badges') === 'earned'

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
                <Link className="btn full" to="/profile/comments">See all ({mine.length})</Link>
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
                <Link className="btn full" to="/profile/activity">See all ({activity.length})</Link>
              </>
            )}
          </section>
        </div>

        <div className="profile-col">
          <section className="profile-sec">
            <h2 className="sec-t">Badges</h2>
            <p className="muted small">No badge unlocks in the demo. Tap one to see how to earn it.</p>
            <ul className="badge-grid plist">
              {BADGES.map((b) => (
                <Badge key={b.id} badge={b} earned={previewEarned} />
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
              Mood photos set the tone on welcome and empty screens. Sample photos on some homes are stand-ins, labeled as such. All are free to use under the{' '}
              <a href={PEXELS_LICENSE_URL} target="_blank" rel="noreferrer">Pexels license</a>.{' '}
              <Link to="/credits">See all photo credits</Link>
            </span>
          </li>
          <li>
            <span>Homes: King County public records. Map: &copy; OpenStreetMap contributors. House drawings are made in code.</span>
          </li>
        </ul>
      </section>
    </div>
  )
}
