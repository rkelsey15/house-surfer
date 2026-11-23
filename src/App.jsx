import { Navigate, Route, Routes } from 'react-router-dom'
import DemoBanner from './components/DemoBanner.jsx'
import Logo from './components/Logo.jsx'
import TabBar from './components/TabBar.jsx'
import ComingSoon from './screens/ComingSoon.jsx'
import HomePage from './screens/HomePage.jsx'
import MapScreen from './screens/MapScreen.jsx'
import Profile from './screens/Profile.jsx'
import Signup from './screens/Signup.jsx'
import Snap from './screens/Snap.jsx'
import Surf from './screens/Surf.jsx'
import { useProfile } from './lib/ProfileContext.jsx'
import { useComments } from './lib/CommentsContext.jsx'
import { useRatings } from './lib/RatingsContext.jsx'

export default function App() {
  const { profile } = useProfile()
  const { karmaFromRatings } = useRatings()
  const { karmaFromComments } = useComments()

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
      <DemoBanner />
      <header className="appbar">
        <Logo />
        {/* Karma so far: ratings and comments. Likes received need other users (V2). */}
        <span className="karma">{karmaFromRatings + karmaFromComments} karma</span>
      </header>

      <main className="main">
        <Routes>
          <Route path="/" element={<Surf />} />
          <Route path="/home/:id" element={<HomePage />} />
          <Route path="/map" element={<MapScreen />} />
          <Route path="/snap" element={<Snap />} />
          <Route path="/top" element={<ComingSoon title="Top homes">The top-rated homes on Queen Anne will show up here.</ComingSoon>} />
          <Route path="/profile" element={<Profile />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <TabBar />
    </div>
  )
}
