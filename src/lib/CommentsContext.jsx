import { createContext, useCallback, useContext, useMemo } from 'react'
import { useStoredState } from './useStoredState.js'
import { useProfile } from './ProfileContext.jsx'

// Comments you write, saved in the browser under "hs.comments".
// Shape: [{ id, homeId, parentId | null, handle, text, at, editedAt?, deleted? }]
// Replies go one level deep: replying to a reply attaches to the top comment.
// Likes you gave are saved under "hs.likes" as { [commentId]: true }.
// Sample comments from other "people" live in sampleData.js, not here.
const CommentsContext = createContext(null)

export const KARMA_PER_COMMENT = 10
export const KARMA_PER_LIKE = 1
export const MAX_COMMENT_LENGTH = 280

const newId = () => `c-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`

export function CommentsProvider({ children }) {
  const { profile } = useProfile()
  const [comments, setComments] = useStoredState('hs.comments', [])
  const [likes, setLikes] = useStoredState('hs.likes', {})

  const addComment = useCallback(
    (homeId, text, parentId = null) => {
      setComments((prev) => [
        ...prev,
        { id: newId(), homeId, parentId, handle: profile?.handle ?? 'Surfer', text, at: new Date().toISOString() },
      ])
    },
    [setComments, profile],
  )

  const editComment = useCallback(
    (id, text) => {
      setComments((prev) => prev.map((c) => (c.id === id ? { ...c, text, editedAt: new Date().toISOString() } : c)))
    },
    [setComments],
  )

  const deleteComment = useCallback(
    (id) => {
      setComments((prev) => prev.map((c) => (c.id === id ? { ...c, deleted: true } : c)))
    },
    [setComments],
  )

  const toggleLike = useCallback(
    (id) => {
      setLikes((prev) => {
        const next = { ...prev }
        if (next[id]) delete next[id]
        else next[id] = true
        return next
      })
    },
    [setLikes],
  )

  const value = useMemo(() => {
    const live = comments.filter((c) => !c.deleted)
    return {
      comments,
      likes,
      addComment,
      editComment,
      deleteComment,
      toggleLike,
      count: live.length,
      karmaFromComments: live.length * KARMA_PER_COMMENT,
    }
  }, [comments, likes, addComment, editComment, deleteComment, toggleLike])

  return <CommentsContext.Provider value={value}>{children}</CommentsContext.Provider>
}

export const useComments = () => useContext(CommentsContext)
