import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// Ensure page always starts at hero on initial load or refresh
if (typeof window !== 'undefined') {
  if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual'
  }
  if (window.location.hash) {
    history.replaceState(null, '', window.location.pathname + window.location.search)
  }
  window.scrollTo(0, 0)
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
