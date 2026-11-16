import { createContext, useContext } from 'react'
import { useStoredState } from './useStoredState.js'

// The player's profile: just an anonymous handle and when they joined.
// No account, no real name. Saved in this browser only.
const ProfileContext = createContext({ profile: null, saveProfile: () => {}, clearProfile: () => {} })

export function ProfileProvider({ children }) {
  const [profile, setProfile] = useStoredState('hs.profile', null)

  const saveProfile = (handle) => setProfile({ handle, joined: new Date().toISOString() })
  const clearProfile = () => setProfile(null)

  return <ProfileContext.Provider value={{ profile, saveProfile, clearProfile }}>{children}</ProfileContext.Provider>
}

export const useProfile = () => useContext(ProfileContext)
