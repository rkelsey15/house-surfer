// The featured badge: ONE earned badge a person shows next to their handle.
// Saved as a single value, `hs.featured_badge` (a badge id). Nothing is saved until they pick.
// Default: Surfer Elite if earned, otherwise the first earned badge (in badge order).

export const defaultFeatured = (earnedIds) => (earnedIds.includes('elite') ? 'elite' : earnedIds[0] ?? null)

// Read the saved value back: only a single string counts (an array, a number or junk is ignored).
export const cleanFeatured = (saved) => (typeof saved === 'string' ? saved : null)

// The badge to show: the saved choice if it is still earned, else the default.
// Always one id or null, never a list.
export const resolveFeatured = (saved, earnedIds) => {
  const s = cleanFeatured(saved)
  return s && earnedIds.includes(s) ? s : defaultFeatured(earnedIds)
}
