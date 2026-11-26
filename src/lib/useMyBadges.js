import { earnedBadgeIds, snappedHomeCount } from './badgeRules.js'
import { useComments } from './CommentsContext.jsx'
import { cleanFeatured, resolveFeatured } from './featured.js'
import { usePhotos } from './PhotosContext.jsx'
import { useRatings } from './RatingsContext.jsx'
import { useStoredState } from './useStoredState.js'

// The visitor's own badges: which are earned (worked out from ratings, comments and Snap photos)
// and which one is featured. Only the featured choice is saved (`hs.featured_badge`).
export function useMyBadges() {
  const { count: ratingCount } = useRatings()
  const { count: commentCount } = useComments()
  const { photos } = usePhotos()
  const [saved, setSaved] = useStoredState('hs.featured_badge', null, cleanFeatured)
  const earnedIds = earnedBadgeIds({ ratingCount, commentCount, snappedHomes: snappedHomeCount(photos) })
  return { earnedIds, saved, setSaved, featured: resolveFeatured(saved, earnedIds), ratingCount, commentCount }
}
