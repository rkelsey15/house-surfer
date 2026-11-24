import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ActivityRow, CommentRow } from '../components/ProfileRows.jsx'
import { ArrowLeftIcon } from '../components/Icons.jsx'
import { useComments } from '../lib/CommentsContext.jsx'
import { useHomes } from '../lib/HomesContext.jsx'
import { usePhotos } from '../lib/PhotosContext.jsx'
import { useProfile } from '../lib/ProfileContext.jsx'
import { useRatings } from '../lib/RatingsContext.jsx'
import { groupByDate, myComments, recentActivity } from '../lib/profileLists.js'

const PAGE = 20

// Everything I have commented (kind "comments") or done (kind "activity"),
// newest first, grouped by day, 20 at a time. Reached from "See all" on Profile.
export default function ProfileList({ kind }) {
  const isComments = kind === 'comments'
  const { profile } = useProfile()
  const { comments, likes } = useComments()
  const { ratings } = useRatings()
  const { photos } = usePhotos()
  const { homes } = useHomes()
  const homeById = useMemo(() => new Map(homes.map((h) => [h.id, h])), [homes])
  const rows = useMemo(
    () =>
      isComments
        ? myComments(comments, profile.handle)
        : recentActivity({ ratings, comments, likes, photos, me: profile.handle, limit: Infinity }),
    [isComments, comments, likes, ratings, photos, profile.handle],
  )
  const [shown, setShown] = useState(PAGE)
  const groups = groupByDate(rows.slice(0, shown), (r) => (isComments ? r.created_at : r.at))

  return (
    <div className="profile-list">
      <Link to="/profile" className="btn quiet back">
        <ArrowLeftIcon />
        Back to Profile
      </Link>
      <h1>{isComments ? 'My comments' : 'Recent activity'}</h1>
      {rows.length === 0 ? (
        <p className="muted center note">
          {isComments ? 'No comments yet. ' : 'Nothing yet. '}
          <Link to="/">Surf the feed</Link> to get started.
        </p>
      ) : (
        groups.map((g) => (
          <section key={g.key}>
            <h2 className="day-t">{g.label}</h2>
            <ul className="plist">
              {g.rows.map((r) =>
                isComments ? <CommentRow key={r.id} c={r} homeById={homeById} /> : <ActivityRow key={r.key} a={r} homeById={homeById} />,
              )}
            </ul>
          </section>
        ))
      )}
      {rows.length > shown && (
        <button className="btn full" onClick={() => setShown((n) => n + PAGE)}>
          Show more ({rows.length - shown} more)
        </button>
      )}
    </div>
  )
}
