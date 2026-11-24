import { Link } from 'react-router-dom'
import { ArrowLeftIcon } from '../components/Icons.jsx'
import { MOOD_PHOTOS, PEXELS_LICENSE_URL, SAMPLE_PHOTOS } from '../lib/credits.js'

// Every stock photo with its photographer. Reached from Credits on Profile.
// Text only on purpose: thumbnails would make a visitor download 20+ photos just to read a list.

function Item({ p, kind }) {
  return (
    <li>
      <span>
        {kind === 'mood' ? 'Photo' : 'Sample photo'}: <a href={p.pageUrl} target="_blank" rel="noreferrer">{p.title}</a> by{' '}
        <a href={p.photographerUrl} target="_blank" rel="noreferrer">{p.photographer}</a> on {p.source}
      </span>
    </li>
  )
}

export default function Credits() {
  return (
    <div className="profile-list">
      <Link to="/profile" className="btn quiet back">
        <ArrowLeftIcon />
        Back to Profile
      </Link>
      <h1>Credits</h1>
      <p className="muted">
        About 1 home in 3 shows a <strong>sample photo</strong> of a house like it. It is a stand-in, not a photo of that home, and every one says so on the picture.
        Your own photos and the drawings are never credited here. All photos are free to use under the{' '}
        <a href={PEXELS_LICENSE_URL} target="_blank" rel="noreferrer">Pexels license</a>.
      </p>
      <h2 className="sec-t">Sample photos on homes</h2>
      <ul className="credit-grid">
        {SAMPLE_PHOTOS.map((p) => <Item key={p.id} p={p} kind="sample" />)}
      </ul>
      <h2 className="sec-t">Mood photos (welcome and empty screens)</h2>
      <ul className="credit-grid">
        {Object.values(MOOD_PHOTOS).map((p) => <Item key={p.file} p={p} kind="mood" />)}
      </ul>
      <h2 className="sec-t">Everything else</h2>
      <p className="muted">Homes: King County public records. Map: &copy; OpenStreetMap contributors. House drawings are made in code.</p>
    </div>
  )
}
