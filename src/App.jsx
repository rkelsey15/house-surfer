import { useEffect } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import DemoBanner from './components/DemoBanner.jsx'
import Logo from './components/Logo.jsx'
import TabBar from './components/TabBar.jsx'
import HomePage from './screens/HomePage.jsx'
import MapScreen from './screens/MapScreen.jsx'
import Profile from './screens/Profile.jsx'
import Credits from './screens/Credits.jsx'
import ProfileList from './screens/ProfileList.jsx'
import Signup from './screens/Signup.jsx'
import Snap from './screens/Snap.jsx'
import Stats from './screens/Stats.jsx'
import Surf from './screens/Surf.jsx'
import Top from './screens/Top.jsx'
import { useProfile } from './lib/ProfileContext.jsx'
import { useComments } from './lib/CommentsContext.jsx'
import { useRatings } from './lib/RatingsContext.jsx'
import { logEvent } from './lib/events.js'

// One app_opened per page load (a module flag survives React's double effect run).
let opened = false

export default function App() {
  const { profile } = useProfile()
  const location = useLocation()
  const { karmaFromRatings } = useRatings()
  const { karmaFromComments } = useComments()

  useEffect(() => {
    if (opened || !profile) return
    opened = true
    logEvent('app_opened', { device: window.matchMedia('(pointer: coarse)').matches ? 'touch' : 'desktop' })
  }, [profile])

  // No handle yet: show the sign-up screen with no tab bar.
  if (!profile) {
    return (
      <>
        <DemoBanner />
        <Signup />
      </>
    )
  }

  return (
    <div className="app">
      <button className="skip" onClick={() => document.getElementById("main")?.focus()}>
        Skip to content
      </button>
      <DemoBanner />
      <header className="appbar">
        <Logo home />
        {/* Karma so far: ratings and comments. Likes received need other users (V2). */}
        <span className="karma">{karmaFromRatings + karmaFromComments} karma</span>
      </header>

      {/* The tab bar comes before the page in the code, so Tab order matches what you see on laptops (tabs at the top). */}
      <TabBar />

      <main className={['/', '/top', '/profile'].includes(location.pathname) ? 'main main-wide' : 'main'} id="main" tabIndex={-1}>
        <Routes>
          <Route path="/" element={<Surf />} />
          <Route path="/home/:id" element={<HomePage />} />
          <Route path="/map" element={<MapScreen />} />
          <Route path="/snap" element={<Snap />} />
          <Route path="/top" element={<Top />} />
          <Route path="/stats" element={<Stats />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/credits" element={<Credits />} />
          <Route path="/profile/comments" element={<ProfileList kind="comments" />} />
          <Route path="/profile/activity" element={<ProfileList kind="activity" />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  )
}
