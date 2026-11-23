import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import App from './App.jsx'
import { CommentsProvider } from './lib/CommentsContext.jsx'
import { GuideProvider } from './lib/GuideContext.jsx'
import { HomesProvider } from './lib/HomesContext.jsx'
import { PhotosProvider } from './lib/PhotosContext.jsx'
import { ProfileProvider } from './lib/ProfileContext.jsx'
import { RatingsProvider } from './lib/RatingsContext.jsx'
import { ThemeProvider } from './lib/ThemeContext.jsx'
import './styles.css'

// HashRouter keeps page links working on GitHub Pages (URLs look like /#/map).
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
      <ProfileProvider>
        <HomesProvider>
          <PhotosProvider>
          <RatingsProvider>
          <CommentsProvider>
            <GuideProvider>
            <HashRouter>
              <App />
            </HashRouter>
          </GuideProvider>
          </CommentsProvider>
        </RatingsProvider>
        </PhotosProvider>
        </HomesProvider>
      </ProfileProvider>
    </ThemeProvider>
  </StrictMode>,
)
