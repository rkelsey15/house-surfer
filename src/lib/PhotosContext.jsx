import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { logEvent } from './events.js'
import { listPhotos, savePhoto } from './photoDb.js'
import { parseCovers } from './sampleCovers.js'
import { chooseCover } from './stockCovers.js'

// Photos saved on this device (IndexedDB), ready to show.
// Shape of each: { id, home_id, created_at, url } where url is a local blob link.
const PhotosContext = createContext({ photos: [], coverUrl: () => null, coverInfo: () => null, photosFor: () => [], addPhoto: async () => {} })

export function PhotosProvider({ children }) {
  const [photos, setPhotos] = useState([])
  // Sample covers you add yourself (public/images/homes/covers.json). Empty until you add some.
  const [samples, setSamples] = useState(() => new Map())

  useEffect(() => {
    let cancelled = false
    fetch(`${import.meta.env.BASE_URL}images/homes/covers.json`)
      .then((res) => (res.ok ? res.json() : {}))
      .then((json) => {
        if (!cancelled) setSamples(parseCovers(json, import.meta.env.BASE_URL))
      })
      .catch(() => {})
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    let cancelled = false
    listPhotos()
      .then((rows) => {
        if (cancelled) return
        const sorted = rows.sort((a, b) => a.created_at.localeCompare(b.created_at))
        setPhotos(sorted.map((r) => ({ id: r.id, home_id: r.home_id, created_at: r.created_at, url: URL.createObjectURL(r.blob) })))
      })
      .catch(() => {
        // IndexedDB blocked (some private windows): the app works without photos.
      })
    return () => {
      cancelled = true
    }
  }, [])

  // Throws if the browser can't save; the Snap screen shows a message.
  const addPhoto = useCallback(async (home_id, blob) => {
    const row = await savePhoto(home_id, blob)
    setPhotos((prev) => [...prev, { id: row.id, home_id, created_at: row.created_at, url: URL.createObjectURL(blob) }])
    logEvent('photo_uploaded', { home_id })
    return row
  }, [])

  const value = useMemo(() => {
    const photosFor = (homeId) => photos.filter((p) => p.home_id === homeId)
    // Real photos always win. Order: the visitor's own Snap photo, then your own photo from
    // public/images/homes/, then (for about 1 home in 3) a stock sample photo, then the drawing.
    const coverInfo = (homeId, home) => chooseCover({ homeId, home, mine: photosFor(homeId)[0]?.url, sample: samples.get(homeId), base: import.meta.env.BASE_URL })
    const coverUrl = (homeId, home) => coverInfo(homeId, home)?.url ?? null
    return { photos, coverUrl, coverInfo, photosFor, addPhoto }
  }, [photos, samples, addPhoto])

  return <PhotosContext.Provider value={value}>{children}</PhotosContext.Provider>
}

export const usePhotos = () => useContext(PhotosContext)
