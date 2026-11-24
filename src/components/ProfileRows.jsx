import { Link } from 'react-router-dom'
import { relativeTime } from '../lib/profileLists.js'

const VERB = { rated: 'Rated', commented: 'Commented on', liked: 'Liked a comment on', snapped: 'Snapped' }

// One of my comments: block address and the comment text. Opens the home.
export function CommentRow({ c, homeById }) {
  return (
    <li>
      <Link to={'/home/' + c.home_id} className="pitem">
        <span className="addr">{homeById.get(c.home_id)?.address ?? 'A home'}</span>
        <span className="pbody">{c.body}</span>
      </Link>
    </li>
  )
}

// One recent action: "Rated 4 stars on 800 block of W Armour St" and how long ago.
export function ActivityRow({ a, homeById }) {
  return (
    <li>
      <Link to={'/home/' + a.home_id} className="pitem">
        <span className="pbody">
          {VERB[a.kind]}
          {a.kind === 'rated' ? ` ${a.stars} ${a.stars === 1 ? 'star' : 'stars'} on` : ''} {homeById.get(a.home_id)?.address ?? 'a home'}
        </span>
        <span className="ptime">{relativeTime(a.at)}</span>
      </Link>
    </li>
  )
}
