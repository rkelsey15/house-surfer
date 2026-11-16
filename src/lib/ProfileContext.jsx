import { createContext, useContext } from 'react'
import { useStoredState } from './useStoredState.js'

// The player's profile: just an anonymous handle and when they joined.
// No account, no real name. Saved in this browser only.
const ProfileContext = createContext({ profile: null, saveProfile: () => {} })

export function ProfileProvider({ children }) {
  const [profile, setProfile] = useStoredState('hs.profile', null)

  const saveProfile = (handle) => setProfile({ handle, joined: new Date().toISOString() })
  // The handle is locked after sign-up: there is deliberately no rename or
  // clear function in V1, so comments always stay tied to the same handle.
  return <ProfileContext.Provider value={{ profile, saveProfile }}>{children}</ProfileContext.Provider>
}

export const useProfile = () => useContext(ProfileContext)
