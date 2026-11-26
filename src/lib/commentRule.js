// The rate-before-you-comment rule. A home has three actions:
//   1. Skip: no rating, no comment.
//   2. Rate it and go on to Next.
//   3. Rate it and comment.
// So a NEW top-level comment needs a star rating on that home. Replies to other people's comments
// do not, and neither does editing your own comment (you could only have written it after rating).
export const RATE_FIRST_MESSAGE = 'Rate this home to leave a comment.'

// `stars` is the visitor's rating of this home (0 or missing means not rated yet).
export const canPostComment = ({ stars = 0, isReply = false }) => isReply || stars > 0
