import { createContext, useContext, useEffect } from 'react'
import { useStoredState } from './useStoredState.js'

// Theme choice: 'system' (follow the device), 'light' or 'dark'.
// The CSS reads <html data-theme="light|dark">; with no attribute it follows
// the device setting through prefers-color-scheme.
const ThemeContext = createContext({ theme: 'system', setTheme: () => {} })

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useStoredState('hs.theme', 'system')

  useEffect(() => {
    const root = document.documentElement
    if (theme === 'light' || theme === 'dark') root.dataset.theme = theme
    else delete root.dataset.theme
  }, [theme])

  return <ThemeContext.Provider value={{ theme, setTheme }}>{children}</ThemeContext.Provider>
}

export const useTheme = () => useContext(ThemeContext)
