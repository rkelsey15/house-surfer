import { createContext, useCallback, useContext, useMemo } from 'react'
import { useStoredState } from './useStoredState.js'
import { useProfile } from './ProfileContext.jsx'
import { readJSON } from './storage.js'

// Comments, saved in the browser as three "tables" shaped like the V2 database
// so they can move to Supabase without reshaping. Columns are snake_case on
// purpose.
//
//   hs.comments       [{ id, home_id, parent_id | null, user, body, created_at, edited_at | null }]
//   hs.comment_edits  [{ comment_id, old_body, edited_at }]        one row per edit (history)
//   hs.likes          [{ comment_id, user, created_at }]           one per user per comment
//
// `user` is the anonymous handle. Replies go one level deep: replying to a
// reply attaches to the top comment. Like counts and karma are never stored;
// they are computed from these rows.
//
// Deleting a comment removes its replies, edit history and likes too (like
// ON DELETE CASCADE in the database).
//
// Sample comments from other "people" (sampleData.js) are never stored here.
const CommentsContext = createContext(null)

export const KARMA_PER_COMMENT = 10
export const KARMA_PER_LIKE = 1
export const MAX_COMMENT_LENGTH = 280

const newId = () => `c-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`
const now = () => new Date().toISOString()

// One-time conversion of the earlier saved format (camelCase fields, likes as
// an object) into the table shape. Runs only when old data is found.
function migrateComments(rows) {
  if (!rows.some((c) => 'homeId' in c)) return rows
  return rows
    .filter((c) => !c.deleted)
    .map((c) => ({
      id: c.id, home_id: c.homeId, parent_id: c.parentId ?? null, user: c.handle,
      body: c.text, created_at: c.at, edited_at: c.editedAt ?? null,
    }))
}
function migrateLikes(likes, user) {
  if (Array.isArray(likes)) return likes
  return Object.keys(likes ?? {}).map((comment_id) => ({ comment_id, user, created_at: now() }))
}

export function CommentsProvider({ children }) {
  const { profile } = useProfile()
  const me = profile?.handle ?? null
  const [comments, setComments] = useStoredState('hs.comments', [], migrateComments)
  const [edits, setEdits] = useStoredState('hs.comment_edits', [])
  const [likes, setLikes] = useStoredState('hs.likes', [], (v) => migrateLikes(v, readJSON('hs.profile', null)?.handle ?? 'Surfer'))

  const addComment = useCallback(
    (home_id, body, parent_id = null) => {
      setComments((prev) => [
        ...prev,
        { id: newId(), home_id, parent_id, user: me ?? 'Surfer', body, created_at: now(), edited_at: null },
      ])
    },
    [setComments, me],
  )

  // Keeps the old text in comment_edits, then updates the comment.
  const editComment = useCallback(
    (id, body) => {
      const at = now()
      const old = comments.find((c) => c.id === id)
      if (!old || old.body === body) return
      setEdits((prev) => [...prev, { comment_id: id, old_body: old.body, edited_at: at }])
      setComments((prev) => prev.map((c) => (c.id === id ? { ...c, body, edited_at: at } : c)))
    },
    [comments, setComments, setEdits],
  )

  const deleteComment = useCallback(
    (id) => {
      const gone = new Set([id, ...comments.filter((c) => c.parent_id === id).map((c) => c.id)])
      setComments((prev) => prev.filter((c) => !gone.has(c.id)))
      setEdits((prev) => prev.filter((e) => !gone.has(e.comment_id)))
      setLikes((prev) => prev.filter((l) => !gone.has(l.comment_id)))
    },
    [comments, setComments, setEdits, setLikes],
  )

  // One like per user per comment: liking again removes it.
  const toggleLike = useCallback(
    (comment_id) => {
      if (!me) return
      setLikes((prev) =>
        prev.some((l) => l.comment_id === comment_id && l.user === me)
          ? prev.filter((l) => !(l.comment_id === comment_id && l.user === me))
          : [...prev, { comment_id, user: me, created_at: now() }],
      )
    },
    [setLikes, me],
  )

  const value = useMemo(() => {
    const mine = comments.filter((c) => c.user === me)
    const myIds = new Set(mine.map((c) => c.id))
    // Likes received on my comments from other people (liking your own is blocked).
    const likesReceived = likes.filter((l) => myIds.has(l.comment_id) && l.user !== me).length
    return {
      comments,
      edits,
      likes,
      addComment,
      editComment,
      deleteComment,
      toggleLike,
      count: mine.length,
      likesReceived,
      karmaFromComments: mine.length * KARMA_PER_COMMENT + likesReceived * KARMA_PER_LIKE,
    }
  }, [comments, edits, likes, me, addComment, editComment, deleteComment, toggleLike])

  return <CommentsContext.Provider value={value}>{children}</CommentsContext.Provider>
}

export const useComments = () => useContext(CommentsContext)
