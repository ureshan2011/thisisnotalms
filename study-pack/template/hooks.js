/* Paged.js lifecycle hooks for the study-pack renderer.
   Injected inline into every intermediate HTML document. */
(function () {
  function start() {
    class StudyPackHandler extends window.Paged.Handler {
      // Repeat the visible watermark on every generated page except the cover.
      afterPageLayout(pageElement) {
        if (pageElement.querySelector('.cover')) return;
        const box = pageElement.querySelector('.pagedjs_pagebox') || pageElement;
        const layer = document.createElement('div');
        layer.className = 'wm-layer';
        const text = document.createElement('div');
        text.className = 'wm-text';
        text.textContent = window.__WM_TEXT__;
        layer.appendChild(text);
        box.appendChild(layer);
      }

      afterRendered(pages) {
        window.__pagedDone = pages.length;
      }
    }

    window.Paged.registerHandlers(StudyPackHandler);

    document.fonts.ready
      .then(() => window.PagedPolyfill.preview())
      .catch((err) => {
        window.__pagedError = String((err && err.stack) || err);
      });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
})();
