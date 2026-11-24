import { usePhotos } from '../lib/PhotosContext.jsx'
import HouseArt from './HouseArt.jsx'

// The picture for a home. Real photos win: the visitor's own Snap photo, then one of your
// own photos from public/images/homes/. After that, about 1 home in 3 shows a stock sample
// photo (labeled), and the rest show the drawing.
export default function HomeCover({ home, height }) {
  const { coverInfo } = usePhotos()
  const cover = coverInfo(home.id, home)
  if (!cover) return <HouseArt home={home} height={height} />
  const h = height ?? 210
  const stock = cover.kind === 'stock'
  const alt =
    cover.kind === 'yours'
      ? `Your photo of a house in the ${home.address}, saved on this device`
      : stock
        ? `Sample photo, not this home. A stock photo shown in place of a house in the ${home.address}`
        : `Photo of a house in the ${home.address}`
  return (
    <div className="cover-wrap">
      {/* loading="lazy": the browser downloads the file only when it is near the screen. */}
      <img className="art cover-photo" src={cover.url} style={{ height: h }} alt={alt} loading="lazy" decoding="async" />
      {stock && (
        <span className="sample-tag" aria-hidden="true">
          {h >= 150 ? 'Sample photo, not this home' : 'Sample photo'}
        </span>
      )}
    </div>
  )
}
