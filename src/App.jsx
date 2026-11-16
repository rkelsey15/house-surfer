import { Navigate, Route, Routes } from 'react-router-dom'
import Logo from './components/Logo.jsx'
import TabBar from './components/TabBar.jsx'
import ComingSoon from './screens/ComingSoon.jsx'
import Profile from './screens/Profile.jsx'
import Signup from './screens/Signup.jsx'
import Surf from './screens/Surf.jsx'
import { useProfile } from './lib/ProfileContext.jsx'
import { useRatings } from './lib/RatingsContext.jsx'

export default function App() {
  const { profile } = useProfile()
  const { karmaFromRatings } = useRatings()

  // No handle yet: show the sign-up screen with no tab bar.
  if (!profile) return <Signup />

  return (
    <div className="app">
      <header className="appbar">
        <Logo />
        {/* Karma so far: ratings only. Takes and likes join in later steps. */}
        <span className="karma">{karmaFromRatings} karma</span>
      </header>

      <main className="main">
        <Routes>
          <Route path="/" element={<Surf />} />
          <Route path="/map" element={<ComingSoon title="Map">The map and list of homes arrive in step 5.</ComingSoon>} />
          <Route path="/snap" element={<ComingSoon title="Snap a house">Take a photo, pick from the 3 nearest homes and rate it. Arrives in step 6.</ComingSoon>} />
          <Route path="/top" element={<ComingSoon title="Top homes">The top-rated homes on Queen Anne will show up here.</ComingSoon>} />
          <Route path="/profile" element={<Profile />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <TabBar />
    </div>
  )
}
