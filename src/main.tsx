import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { PLATFORM_ACTIVE } from './config/platform'

// Leaflet is only needed by the full platform (map-based pages). In shutdown
// mode only the XR Explorer renders, so we skip loading it entirely to avoid
// pulling in unnecessary CSS/marker assets.
if (PLATFORM_ACTIVE) {
  void (async () => {
    const L = (await import('leaflet')).default
    await import('leaflet/dist/leaflet.css')
    const markerIcon2x = (await import('leaflet/dist/images/marker-icon-2x.png')).default
    const markerIcon = (await import('leaflet/dist/images/marker-icon.png')).default
    const markerShadow = (await import('leaflet/dist/images/marker-shadow.png')).default
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: markerIcon2x,
      iconUrl: markerIcon,
      shadowUrl: markerShadow,
    })
  })()
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
