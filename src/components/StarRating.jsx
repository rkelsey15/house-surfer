import { ratedText, starLabel } from '../lib/a11y.js'

// Five tappable stars. `value` is 0 (not rated) to 5.
// Each star is a real button (Tab and Enter or Space work), named "Rate 4 of 5 stars".
// The chosen rating is announced to screen readers, and empty stars are outlines
// so a filled star differs by shape, not only by color.
export default function StarRating({ value, onChange }) {
  return (
    <div className="stars" role="group" aria-label="Your rating">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          aria-pressed={value === n}
          aria-label={starLabel(n)}
          className={n <= value ? 'star on' : 'star'}
          onClick={() => onChange(n)}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="m12 2.8 2.8 5.9 6.4.8-4.7 4.4 1.2 6.4L12 17.2l-5.7 3.1 1.2-6.4L2.8 9.5l6.4-.8z" />
          </svg>
        </button>
      ))}
      <span className="sr-only" role="status">{value ? ratedText(value) : ''}</span>
    </div>
  )
}
