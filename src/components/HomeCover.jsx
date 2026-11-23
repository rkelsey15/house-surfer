import { usePhotos } from '../lib/PhotosContext.jsx'
import HouseArt from './HouseArt.jsx'

// The picture for a home: its first saved photo, or the drawing until then.
export default function HomeCover({ home, height }) {
  const { coverUrl } = usePhotos()
  const url = coverUrl(home.id)
  if (!url) return <HouseArt home={home} height={height} />
  return (
    <img
      className="art cover-photo"
      src={url}
      style={{ height: height ?? 210 }}
      alt={`Your photo of a house in the ${home.address}, saved on this device`}
    />
  )
}
