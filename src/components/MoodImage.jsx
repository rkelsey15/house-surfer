import { creditLine } from '../lib/credits.js'

// A stock photo used only for mood (welcome screen, empty states). It is
// decoration, so it has no alt text; the photographer is credited on the photo
// and with links in "Credits" on the Profile screen.
export default function MoodImage({ photo, height = 160, position = 'center', className = '' }) {
  return (
    <figure className={`mood ${className}`.trim()} style={{ height }}>
      <img src={import.meta.env.BASE_URL + photo.file} alt="" loading="lazy" style={{ objectPosition: position }} />
      <figcaption className="mood-credit">{creditLine(photo)}</figcaption>
    </figure>
  )
}

// A friendly empty state: a mood photo, a short title and a line or two of help.
export function EmptyState({ photo, position, title, children }) {
  return (
    <div className="empty-state">
      <MoodImage photo={photo} height={120} position={position} />
      <div className="empty-text">
        {title && <h3>{title}</h3>}
        {children}
      </div>
    </div>
  )
}
