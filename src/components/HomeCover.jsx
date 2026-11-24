import { usePhotos } from '../lib/PhotosContext.jsx'
import HouseArt from './HouseArt.jsx'

// The picture for a home: its first saved photo, or the drawing until then.
export default function HomeCover({ home, height }) {
  const { coverInfo } = usePhotos()
  const cover = coverInfo(home.id)
  if (!cover) return <HouseArt home={home} height={height} />
  return (
    <img
      className="art cover-photo"
      src={cover.url}
      style={{ height: height ?? 210 }}
      alt={cover.kind === 'yours' ? `Your photo of a house in the ${home.address}, saved on this device` : `Photo of a house in the ${home.address}`}
    />
  )
}
