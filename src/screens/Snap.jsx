import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import HouseArt from '../components/HouseArt.jsx'
import { ArrowLeftIcon, CameraIcon } from '../components/Icons.jsx'
import { useHomes } from '../lib/HomesContext.jsx'
import { usePhotos } from '../lib/PhotosContext.jsx'
import { factsLine, typeLine } from '../lib/format.js'
import { makeSamplePhoto, shrinkImage } from '../lib/imageTools.js'
import { nearestHomes, searchHomes } from '../lib/nearest.js'

// Snap a house: 1) get a photo, 2) pick the house, 3) confirm and save.
// The photo is shrunk on a canvas (which also drops GPS data) and saved on this
// device only, in IndexedDB. Location is used only to sort the "near me" list.

const ERRORS = {
  'not-image': "That file isn't a photo. Choose a JPEG or PNG image.",
  'too-big': 'That photo is too large (over 30 MB). Try a smaller one.',
}
const READ_ERROR = "We couldn't read that photo. Try a different one (JPEG and PNG work best)."

// A far-away visitor (this demo only covers Queen Anne) shouldn't see homes
// from across the country as "nearest".
const TOO_FAR_METERS = 1500

function HomeChoice({ home, onPick }) {
  return (
    <button className="pick" onClick={() => onPick(home)}>
      <span className="pick-art"><HouseArt home={home} height={64} /></span>
      <span className="pick-text">
        <span className="addr">{home.address}</span>
        <span className="facts">{typeLine(home)}</span>
        <span className="facts">{factsLine(home)}</span>
      </span>
    </button>
  )
}

export default function Snap() {
  const { homes, status } = useHomes()
  const { addPhoto } = usePhotos()
  const navigate = useNavigate()

  const [step, setStep] = useState('photo')
  const [photo, setPhoto] = useState(null) // { blob, url }
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState(null)
  const [home, setHome] = useState(null)
  const [confirmed, setConfirmed] = useState(false)
  const [saving, setSaving] = useState(false)

  const [mode, setMode] = useState('near') // 'near' or 'search'
  const [near, setNear] = useState({ state: 'idle', list: [] }) // idle | asking | ready | denied | far | unsupported
  const [query, setQuery] = useState('')

  const cameraRef = useRef(null)
  const libraryRef = useRef(null)
  const uploadRef = useRef(null)
  const isPhone = window.matchMedia('(pointer: coarse)').matches

  // Free the preview image when it is replaced or the screen closes.
  useEffect(() => () => photo && URL.revokeObjectURL(photo.url), [photo])

  async function loadBlob(promise) {
    setBusy(true)
    setError(null)
    try {
      const blob = await promise
      setPhoto({ blob, url: URL.createObjectURL(blob) })
      setStep('house')
    } catch (err) {
      setError(ERRORS[err.message] ?? READ_ERROR)
    } finally {
      setBusy(false)
    }
  }

  function onFile(e) {
    const file = e.target.files?.[0]
    e.target.value = '' // lets the same file be chosen again
    if (file) loadBlob(shrinkImage(file))
  }

  function askLocation() {
    if (!navigator.geolocation) {
      setNear({ state: 'unsupported', list: [] })
      setMode('search')
      return
    }
    setNear({ state: 'asking', list: [] })
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        // Only the sorted homes are kept; the coordinates are dropped right here.
        const found = nearestHomes(homes, pos.coords.latitude, pos.coords.longitude, 5)
        if (!found.length || found[0].meters > TOO_FAR_METERS) {
          setNear({ state: 'far', list: [] })
          setMode('search')
        } else {
          setNear({ state: 'ready', list: found.map((f) => f.home) })
        }
      },
      () => {
        setNear({ state: 'denied', list: [] })
        setMode('search')
      },
      { timeout: 12000, maximumAge: 60000 },
    )
  }

  function pickHome(h) {
    setHome(h)
    setConfirmed(false)
    setStep('confirm')
  }

  async function save() {
    setSaving(true)
    setError(null)
    try {
      await addPhoto(home.id, photo.blob)
      setStep('saved')
    } catch {
      setError("This browser couldn't save the photo (private windows can block it). Nothing was saved.")
    } finally {
      setSaving(false)
    }
  }

  function startOver() {
    setPhoto(null)
    setHome(null)
    setConfirmed(false)
    setError(null)
    setQuery('')
    setStep('photo')
  }

  const results = searchHomes(homes, query)

  return (
    <div className="snap-screen">
      <h1>Snap a house</h1>

      {step === 'photo' && (
        <>
          <p className="muted">Photos stay on this device. Nothing is uploaded anywhere.</p>
          <div className="snap-actions">
            {isPhone ? (
              <>
                <button className="btn pri full" disabled={busy} onClick={() => cameraRef.current.click()}>
                  <CameraIcon /> Take a photo
                </button>
                <button className="btn full" disabled={busy} onClick={() => libraryRef.current.click()}>
                  Choose from library
                </button>
              </>
            ) : (
              <button className="btn pri full" disabled={busy} onClick={() => uploadRef.current.click()}>
                Upload a photo
              </button>
            )}
            <button className="btn full" disabled={busy} onClick={() => loadBlob(makeSamplePhoto())}>
              Use a sample photo
            </button>
          </div>
          {busy && <p className="muted center note" role="status">Preparing photo…</p>}
          {error && <p className="blocked" role="alert">{error}</p>}
          <input ref={cameraRef} type="file" accept="image/*" capture="environment" hidden onChange={onFile} />
          <input ref={libraryRef} type="file" accept="image/*" hidden onChange={onFile} />
          <input ref={uploadRef} type="file" accept="image/*" hidden onChange={onFile} />
        </>
      )}

      {step === 'house' && (
        <>
          <img className="snap-thumb" src={photo.url} alt="The photo you chose" />
          <h2 className="sec-t">Which house is it?</h2>
          <div className="seg" role="group" aria-label="How to find the house">
            <button className={mode === 'near' ? 'on' : ''} aria-pressed={mode === 'near'} onClick={() => setMode('near')}>
              Near me
            </button>
            <button className={mode === 'search' ? 'on' : ''} aria-pressed={mode === 'search'} onClick={() => setMode('search')}>
              Search address
            </button>
          </div>

          {mode === 'near' && (
            <div className="snap-block">
              {near.state === 'ready' ? (
                <>
                  <p className="muted small">The 5 closest homes, nearest first. Your location isn't saved.</p>
                  {near.list.map((h) => <HomeChoice key={h.id} home={h} onPick={pickHome} />)}
                </>
              ) : (
                <>
                  <p className="muted small">Allow location to see the 5 homes closest to you. It's only used to sort this list and is never saved.</p>
                  <button className="btn pri full" disabled={near.state === 'asking' || status !== 'ready'} onClick={askLocation}>
                    {near.state === 'asking' ? 'Finding you…' : 'Use my location'}
                  </button>
                </>
              )}
            </div>
          )}

          {mode === 'search' && (
            <div className="snap-block">
              {near.state === 'denied' && <p className="muted small">Location is off, so search by address instead.</p>}
              {near.state === 'unsupported' && <p className="muted small">This browser can't share location, so search by address instead.</p>}
              {near.state === 'far' && <p className="muted small">You don't seem to be in Queen Anne, which is the only neighborhood in this demo. Search by address instead.</p>}
              <input
                className="mapsearch"
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Street, like Warren or 1st Ave"
                aria-label="Search address"
              />
              {query.trim() && results.length === 0 && <p className="muted center note">No homes match that.</p>}
              {results.map((h) => <HomeChoice key={h.id} home={h} onPick={pickHome} />)}
            </div>
          )}

          <button className="btn quiet" onClick={startOver}><ArrowLeftIcon />Use a different photo</button>
        </>
      )}

      {step === 'confirm' && (
        <>
          <img className="snap-thumb" src={photo.url} alt="The photo you chose" />
          <div className="snap-block">
            <HomeChoice home={home} onPick={() => setStep('house')} />
            <button className="btn quiet" onClick={() => setStep('house')}>Change house</button>
          </div>
          <div className="snap-rule" role="note">
            <b>No people or license plates.</b>
            <span>Only photograph a house from the public sidewalk. Skip photos showing people or a plate.</span>
          </div>
          <label className="snap-check">
            <input type="checkbox" checked={confirmed} onChange={(e) => setConfirmed(e.target.checked)} />
            <span>This photo has no people or license plates</span>
          </label>
          {error && <p className="blocked" role="alert">{error}</p>}
          <button className="btn pri full" disabled={!confirmed || saving} onClick={save}>
            {saving ? 'Saving…' : 'Save photo on this device'}
          </button>
        </>
      )}

      {step === 'saved' && (
        <>
          <img className="snap-thumb" src={photo.url} alt="The photo you saved" />
          <p className="snap-done" role="status">Saved on this device.</p>
          <p className="muted">It's now the cover for {home.address}. Nobody else can see it.</p>
          <div className="snap-actions">
            <button className="btn pri full" onClick={() => navigate('/home/' + home.id, { state: { source: 'snap' } })}>Rate this house</button>
            <button className="btn full" onClick={startOver}>Snap another</button>
            <Link className="btn quiet" to="/">Back to Surf</Link>
          </div>
        </>
      )}
    </div>
  )
}
