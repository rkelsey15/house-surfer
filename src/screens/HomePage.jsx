import { useMemo, useState } from 'react'
import { useEffect, useId, useRef } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import HomeCover from '../components/HomeCover.jsx'
import StarRating from '../components/StarRating.jsx'
import { useComments, MAX_COMMENT_LENGTH } from '../lib/CommentsContext.jsx'
import { useGuide } from '../lib/GuideContext.jsx'
import { useHomes } from '../lib/HomesContext.jsx'
import { usePhotos } from '../lib/PhotosContext.jsx'
import { useProfile } from '../lib/ProfileContext.jsx'
import { useRatings } from '../lib/RatingsContext.jsx'
import { factsLine, typeLine } from '../lib/format.js'
import { ArrowLeftIcon, ArrowRightIcon, ArrowUpIcon, CheckIcon } from '../components/Icons.jsx'
import { logEvent } from '../lib/events.js'
import { advanceFeed } from '../lib/feedSession.js'
import { moderate } from '../lib/moderation.js'
import { BLOCK_MESSAGE, WHY_MESSAGE } from '../lib/moderation-words.js'
import { LAPTOP_QUERY, useMediaQuery } from '../lib/useMediaQuery.js'
import { isSample, sampleComments, sampleLikes, sampleRating } from '../lib/sampleData.js'

function timeAgo(iso) {
  const mins = Math.floor((Date.now() - new Date(iso).getTime()) / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m`
  if (mins < 60 * 24) return `${Math.floor(mins / 60)}h`
  return `${Math.floor(mins / 60 / 24)}d`
}

// A box for writing a new comment, a reply, or an edit.
function Composer({ initial = '', placeholder, button, onSubmit, onCancel, autoFocus }) {
  const [text, setText] = useState(initial)
  const [error, setError] = useState(null)
  const { markDone } = useGuide()
  const errorRef = useRef(null)
  const errorId = useId()
  const [blockCount, setBlockCount] = useState(0)
  // A blocked comment: the message is shown and focus moves to it, so a screen reader reads it.
  useEffect(() => {
    if (blockCount) errorRef.current?.focus()
  }, [blockCount])

  const submit = () => {
    const t = text.trim()
    if (!t) return
    const result = moderate(t)
    if (!result.ok) {
      logEvent('comment_blocked', { reason: result.reason })
      markDone('moderation')
      setBlockCount((n) => n + 1)
      return setError(BLOCK_MESSAGE)
    }
    onSubmit(t)
    setText('')
    setError(null)
  }

  return (
    <div className="composer">
      <textarea
        value={text}
        maxLength={MAX_COMMENT_LENGTH}
        placeholder={placeholder}
        autoFocus={autoFocus}
        aria-label={placeholder}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        onChange={(e) => {
          setText(e.target.value)
          setError(null)
        }}
      />
      {error && (
        <div className="blocked" id={errorId} ref={errorRef} tabIndex={-1}>
          <p><b>{error}</b></p>
          <p className="why">{WHY_MESSAGE}</p>
        </div>
      )}
      <div className="composer-bar">
        <span className="muted small">{text.length}/{MAX_COMMENT_LENGTH}</span>
        {onCancel && <button className="btn" onClick={onCancel}>Cancel</button>}
        <button className="btn pri" onClick={submit} disabled={!text.trim()}>{button}</button>
      </div>
    </div>
  )
}

function CommentView({ c, isReply, likeCount, liked, replying, onReply, editing, onEdit, actions }) {
  const { profile } = useProfile()
  const { toggleLike } = useComments()
  const sample = isSample(c)
  const mine = !sample && c.user === profile.handle

  // Deleted comments that still have replies show only a placeholder.
  if (c.deleted_at) {
    return (
      <div className="comment">
        <p className="muted">[deleted]</p>
      </div>
    )
  }

  return (
    <div className={`comment${isReply ? ' reply' : ''}`}>
      <div className="who">
        <b>{c.user}</b>
        {sample && <span className="sample-tag" title="Made-up sample comment">sample</span>}
        {' · '}{timeAgo(c.created_at)}{c.edited_at ? ' · edited' : ''}
      </div>
      {editing ? (
        <Composer
          initial={c.body}
          placeholder="Edit your comment"
          button="Save"
          autoFocus
          onSubmit={(t) => actions.saveEdit(c.id, t)}
          onCancel={actions.cancel}
        />
      ) : (
        <p>{c.body}</p>
      )}
      {!editing && (
        <div className="meta">
          <button
            className={liked ? 'liked' : ''}
            onClick={() => toggleLike(c.id)}
            disabled={mine}
            aria-pressed={liked}
            aria-label={`Like, ${likeCount} like${likeCount === 1 ? '' : 's'}${mine ? ' (you cannot like your own comment)' : ''}`}
          >
            <ArrowUpIcon /> {likeCount}
          </button>
          <button onClick={onReply} aria-label={`Reply to ${c.user}`}>Reply</button>
          {mine && <button onClick={onEdit} aria-label="Edit your comment">Edit</button>}
          {mine && <button onClick={() => actions.remove(c.id)} aria-label="Delete your comment">Delete</button>}
        </div>
      )}
      {replying && (
        <Composer
          placeholder={`Reply to ${c.user}`}
          button="Reply"
          autoFocus
          onSubmit={(t) => actions.postReply(c, t)}
          onCancel={actions.cancel}
        />
      )}
    </div>
  )
}

export default function HomePage() {
  const { id } = useParams()
  // `key={id}` makes React throw away this screen's state when "Next house" changes the
  // URL: otherwise the "Saved" bar, an open reply box or edit mode from the last house
  // would carry over to the next one. It also logs `home_viewed` once per house.
  return <HomePageFor key={id} id={id} />
}

function HomePageFor({ id }) {
  const laptop = useMediaQuery(LAPTOP_QUERY)
  const location = useLocation()
  const viewed = useRef(null)
  useEffect(() => {
    if (viewed.current === id) return
    viewed.current = id
    logEvent('home_viewed', { home_id: id, source: location.state?.source ?? 'other' })
  }, [id, location.state])
  const navigate = useNavigate()
  const { homes, status } = useHomes()
  const { ratings, rate } = useRatings()
  const { comments, likes, addComment, editComment, deleteComment } = useComments()
  // Opened from Surf: offer "Next house" (the next one in the feed). After a rating or a
  // comment saves, "Saved" appears with a Next house button right there.
  const fromFeed = location.state?.source === 'feed'
  const [saved, setSaved] = useState(null) // 'rating' | 'comment' | null
  const titleRef = useRef(null)
  useEffect(() => {
    // Arrived with "Next house": move focus to the new house's title so a screen reader starts there.
    if (location.state?.advanced) titleRef.current?.focus()
    window.scrollTo(0, 0)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps
  const goNext = () => {
    const next = advanceFeed(homes, ratings, id)
    if (next) navigate('/home/' + next.id, { state: { source: 'feed', advanced: true }, replace: true })
    else navigate('/')
  }
  const [replyTo, setReplyTo] = useState(null)
  const [editId, setEditId] = useState(null)

  const { profile } = useProfile()
  const { photosFor } = usePhotos()
  const home = homes.find((h) => h.id === id)

  // Sample comments plus yours, grouped into threads (top comment + replies).
  // Made-up sample comments (ids start with "sample-", never saved, never editable) are
  // shown together with the real ones saved in hs.comments. `isSample(c)` tells them apart.
  const threads = useMemo(() => {
    const all = [...sampleComments(id), ...comments.filter((c) => c.home_id === id)]
    const byTime = (a, b) => a.created_at.localeCompare(b.created_at)
    return all
      .filter((c) => !c.parent_id)
      .map((top) => ({ top, replies: all.filter((r) => r.parent_id === top.id && !r.deleted_at).sort(byTime) }))
      // A deleted comment stays as "[deleted]" only while it still has replies.
      .filter((t) => !t.top.deleted_at || t.replies.length > 0)
      .sort((a, b) => byTime(b.top, a.top))
  }, [id, comments])

  // Like counts are computed from the likes rows (sample rows + yours).
  const likeRows = useMemo(() => [...sampleLikes(id), ...likes], [id, likes])
  const likeProps = (c) => ({
    likeCount: likeRows.filter((l) => l.comment_id === c.id).length,
    liked: likeRows.some((l) => l.comment_id === c.id && l.user === profile.handle),
  })

  if (status === 'loading') return <p className="muted center">Loading…</p>
  if (!home) {
    return (
      <div className="coming">
        <h2>Home not found</h2>
        <button className="btn" onClick={() => navigate('/')}>Back to Surf</button>
      </div>
    )
  }

  const mine = ratings[id]?.stars ?? 0
  const sample = sampleRating(id)
  const total = sample.count + (mine ? 1 : 0)
  const average = total ? ((sample.sum + mine) / total).toFixed(1) : null

  const cancel = () => {
    setReplyTo(null)
    setEditId(null)
  }
  const actions = {
    cancel,
    saveEdit: (cid, text) => {
      editComment(cid, text)
      cancel()
    },
    postReply: (parent, text) => {
      addComment(id, text, parent.parent_id ?? parent.id)
      setSaved('comment')
      cancel()
    },
    remove: (cid) => {
      if (window.confirm('Delete this comment?')) deleteComment(cid)
    },
  }

  const commentProps = (c, isReply) => ({
    c,
    isReply,
    actions,
    ...likeProps(c),
    replying: replyTo === c.id,
    editing: editId === c.id,
    onReply: () => {
      setEditId(null)
      setReplyTo(c.id)
    },
    onEdit: () => {
      setReplyTo(null)
      setEditId(c.id)
    },
  })

  return (
    <div>
      <div className="home-top">
        <button className="btn quiet back" onClick={() => navigate(-1)}><ArrowLeftIcon />Back</button>
        {fromFeed && (
          <button className="btn pri" onClick={goNext}>
            Next house<ArrowRightIcon />
          </button>
        )}
      </div>

      {/* Laptops: picture, rating and stars stay in view on the left; comments scroll on the right. */}
      <div className="home-grid">
      <div className="home-side">
      <div className="card">
        <HomeCover home={home} height={laptop ? 280 : undefined} />
        <div className="info">
          <h1 className="addr" tabIndex={-1} ref={titleRef}>{home.address}</h1>
          <div className="facts">{typeLine(home)}</div>
          <div className="facts">{factsLine(home)}</div>
        </div>
      </div>

      {photosFor(id).length > 1 && (
        <div className="photo-strip" aria-label="More photos of this house, saved on this device">
          {photosFor(id).slice(1).map((p) => (
            <img key={p.id} src={p.url} alt="Another photo of this house, saved on this device" />
          ))}
        </div>
      )}

      <div className="avg">
        {average ? (
          <>
            <b>{average}</b> <span className="star-glyph" aria-hidden="true">★</span>
            <span className="muted"> · {total} rating{total === 1 ? '' : 's'}</span>
          </>
        ) : (
          <span className="muted">No ratings yet. Be the first.</span>
        )}
      </div>
      <p className="muted center small">Other people's ratings are made-up samples. Yours counts too.</p>

      <p className="rate-label">{mine ? `You gave it ${mine} star${mine > 1 ? 's' : ''}` : 'Your rating'}</p>
      <StarRating
        value={mine}
        onChange={(n) => {
          rate(id, n)
          setSaved('rating')
        }}
      />

      </div>
      <div className="home-comments">
      <h2 className="sec-t">Comments</h2>
      <Composer placeholder="Say something about the house…" button="Post comment"
        onSubmit={(t) => {
          addComment(id, t)
          setSaved('comment')
        }}
      />

      {threads.length === 0 && <p className="muted center note">No comments yet. Say something about the house.</p>}
      {threads.map(({ top, replies }) => (
        <div key={top.id}>
          <CommentView {...commentProps(top, false)} />
          {replies.map((r) => (
            <CommentView key={r.id} {...commentProps(r, true)} />
          ))}
        </div>
      ))}

      </div>
      </div>

      {saved && (
        <>
          <div className="saved-spacer" aria-hidden="true" />
          <div className="saved-bar" role="status">
            <span className="saved-text">
              <CheckIcon />
              Saved<span className="sr-only">: your {saved}</span>
            </span>
            {fromFeed && (
              <button className="btn pri" onClick={goNext}>
                Next house<ArrowRightIcon />
              </button>
            )}
          </div>
        </>
      )}
    </div>
  )
}
