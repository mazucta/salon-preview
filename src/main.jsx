import React from 'react'
import ReactDOM from 'react-dom/client'
// Self-hosted fonts (no Google Fonts request): Unbounded display + Golos Text body
import '@fontsource/unbounded/400.css'
import '@fontsource/unbounded/500.css'
import '@fontsource/unbounded/600.css'
import '@fontsource/golos-text/400.css'
import '@fontsource/golos-text/500.css'
import '@fontsource/golos-text/600.css'
import App from './App.jsx'
import './i18n' // initialise i18next before the app renders
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
