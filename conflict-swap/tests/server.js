// Minimal static file server for conflict-swap.html during tests.
// Deliberately dependency-free (no `serve`/`http-server` package) so the
// test package only needs @playwright/test installed.
const http = require('http');
const fs = require('fs');
const path = require('path');

// The page itself lives in the Vite app's public/ folder (see
// public/conflict-swap.html) so it ships with the existing GitHub Pages
// build, exactly like public/security-lab.html — these tests just serve
// that same file directly, without going through a Vite build.
const ROOT = path.resolve(__dirname, '..', '..', 'public');
const PORT = process.env.PORT || 8811;

const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css' };

http.createServer((req, res) => {
  const urlPath = req.url.split('?')[0];
  const filePath = path.join(ROOT, urlPath === '/' ? '/conflict-swap.html' : urlPath);
  if (!filePath.startsWith(ROOT)) { res.writeHead(403); res.end(); return; }
  fs.readFile(filePath, (err, data) => {
    if (err) { res.writeHead(404); res.end('Not found'); return; }
    const ext = path.extname(filePath);
    res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' });
    res.end(data);
  });
}).listen(PORT, () => {
  console.log(`conflict-swap test server on http://localhost:${PORT}`);
});
