// Built-in profile pictures: the outline house in eight colors. No photo upload: handles are
// anonymous, and photos would need moderation (V2). The choice is one saved value, `hs.avatar`,
// holding the avatar id. Colors are CSS tokens (--b-*) so they work in light and dark.
export const AVATARS = [
  { id: 'teal', name: 'Teal', fg: '--brand', bg: '--brand-soft' },
  { id: 'green', name: 'Green', fg: '--b-green', bg: '--b-green-soft' },
  { id: 'blue', name: 'Blue', fg: '--b-blue', bg: '--b-blue-soft' },
  { id: 'purple', name: 'Purple', fg: '--b-purple', bg: '--b-purple-soft' },
  { id: 'coral', name: 'Coral', fg: '--b-coral', bg: '--b-coral-soft' },
  { id: 'amber', name: 'Amber', fg: '--b-amber', bg: '--b-amber-soft' },
  { id: 'pink', name: 'Pink', fg: '--b-pink', bg: '--b-pink-soft' },
  { id: 'slate', name: 'Slate', fg: '--b-slate', bg: '--b-slate-soft' },
]
export const DEFAULT_AVATAR = 'teal'

// Anything saved that is not a known id (old, edited or broken data) means the default.
export const cleanAvatar = (saved) => (AVATARS.some((a) => a.id === saved) ? saved : DEFAULT_AVATAR)
export const avatarName = (id) => `${AVATARS.find((a) => a.id === id)?.name ?? 'Teal'} house`
