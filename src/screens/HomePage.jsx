import { useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import HouseArt from '../components/HouseArt.jsx'
import StarRating from '../components/StarRating.jsx'
import { useComments, MAX_COMMENT_LENGTH } from '../lib/CommentsContext.jsx'
import { useGuide } from '../lib/GuideContext.jsx'
import { useHomes } from '../lib/HomesContext.jsx'
import { useProfile } from '../lib/ProfileContext.jsx'
import { useRatings } from '../lib/RatingsContext.jsx'
import { factsLine, typeLine } from '../lib/format.js'
import { checkComment } from '../lib/moderation.js'
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

  const submit = () => {
    const t = text.trim()
    if (!t) return
    const problem = checkComment(t)
    if (problem) {
      markDone('moderation')
      return setError(problem)
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
        onChange={(e) => {
          setText(e.target.value)
          setError(null)
        }}
      />
      {error && <p className="blocked" role="alert">{error}</p>}
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
            aria-label={`${likeCount} likes${liked ? ', liked by you' : ''}`}
          >
            ▲ {likeCount}
          </button>
          <button onClick={onReply}>Reply</button>
          {mine && <button onClick={onEdit}>Edit</button>}
          {mine && <button onClick={() => actions.remove(c.id)}>Delete</button>}
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
  const navigate = useNavigate()
  const { homes, status } = useHomes()
  const { ratings, rate } = useRatings()
  const { comments, likes, addComment, editComment, deleteComment } = useComments()
  const [replyTo, setReplyTo] = useState(null)
  const [editId, setEditId] = useState(null)

  const { profile } = useProfile()
  const home = homes.find((h) => h.id === id)

  // Sample comments plus yours, grouped into threads (top comment + replies).
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
      <button className="back" onClick={() => navigate(-1)}>← Back</button>

      <div className="card">
        <HouseArt home={home} />
        <div className="info">
          <div className="addr">{home.address}</div>
          <div className="facts">{typeLine(home)}</div>
          <div className="facts">{factsLine(home)}</div>
        </div>
      </div>

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
      <StarRating value={mine} onChange={(n) => rate(id, n)} />

      <h2 className="sec-t">Comments</h2>
      <Composer placeholder="Say something about the house…" button="Post comment" onSubmit={(t) => addComment(id, t)} />

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
  )
}
