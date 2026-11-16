import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import App from './App.jsx'
import { HomesProvider } from './lib/HomesContext.jsx'
import { ProfileProvider } from './lib/ProfileContext.jsx'
import { ThemeProvider } from './lib/ThemeContext.jsx'
import './styles.css'

// HashRouter keeps page links working on GitHub Pages (URLs look like /#/map).
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
      <ProfileProvider>
        <HomesProvider>
          <HashRouter>
            <App />
          </HashRouter>
        </HomesProvider>
      </ProfileProvider>
    </ThemeProvider>
  </StrictMode>,
)
