import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/thisisnotalms/',

  build: {
    // Modern browsers only — smaller output, no legacy polyfills
    target: 'es2020',

    // Raise warning threshold slightly; our per-page chunks are intentionally small
    chunkSizeWarningLimit: 600,

    rollupOptions: {
      output: {
        // Split heavy vendor libraries into separate chunks so the browser can
        // cache them independently from app code. When a student loads page A
        // and then navigates to page B, only the page-B chunk is downloaded —
        // the shared vendor chunks are already cached.
        manualChunks(id) {
          if (!id.includes('node_modules')) return undefined;

          // Firebase — large SDK, rarely changes between deploys
          if (id.includes('firebase')) return 'vendor-firebase';

          // Recharts + its d3 dependencies
          if (id.includes('recharts') || id.includes('d3-') || id.includes('victory-vendor')) return 'vendor-charts';

          // Three.js + React Three Fiber/Drei (only needed on 3D classroom page)
          if (id.includes('three') || id.includes('@react-three')) return 'vendor-three';

          // Leaflet map libraries (only needed on pages that render a map)
          if (id.includes('leaflet') || id.includes('react-leaflet')) return 'vendor-map';

          // jsPDF is imported dynamically, and only when somebody presses
          // "Save as PDF". Keep it and its optional companions out of the
          // shared vendor chunk, so a reader who never asks for a document
          // never downloads any of it. jsPDF references canvg, dompurify and
          // core-js for features this code does not use; without this they
          // get hoisted into vendor-react and ship on every page.
          if (
            id.includes('jspdf')
            || id.includes('fflate')
            || id.includes('fast-png')
            || id.includes('canvg')
            || id.includes('dompurify')
            || id.includes('core-js')
            || id.includes('rgbcolor')
            || id.includes('stackblur')
            || id.includes('html2canvas')
          ) return 'vendor-pdf';

          // React core + router + everything else in node_modules goes into one
          // stable vendor chunk. Avoids circular chunk warnings from libraries
          // (e.g. lucide-react) that themselves depend on react.
          return 'vendor-react';
        },
      },
    },
  },
})
