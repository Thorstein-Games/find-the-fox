// Serve the static export the way GitHub Pages does: the exact file, then
// dir/index.html, then path.html, else 404.html with a 404 status (which is
// how /room/<code> links reach the room page). Used by `pnpm preview` and e2e.
// usage: node scripts/serve-static.mjs [dir=out] [port=3000]
import fs from 'fs';
import http from 'http';
import path from 'path';

const root = path.resolve(process.argv[2] || 'out');
const port = Number(process.argv[3] || 3000);
const types = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.mp3': 'audio/mpeg',
  '.txt': 'text/plain',
  '.xml': 'application/xml',
  '.webmanifest': 'application/manifest+json',
  '.woff2': 'font/woff2',
};

const isFile = (f) => f.startsWith(root) && fs.existsSync(f) && fs.statSync(f).isFile();

http
  .createServer((req, res) => {
    const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    for (const candidate of [pathname, path.join(pathname, 'index.html'), `${pathname}.html`]) {
      const file = path.join(root, candidate);
      if (isFile(file)) {
        res.writeHead(200, { 'content-type': types[path.extname(file)] || 'application/octet-stream' });
        fs.createReadStream(file).pipe(res);
        return;
      }
    }
    if (!pathname.endsWith('/') && isFile(path.join(root, pathname, 'index.html'))) {
      res.writeHead(301, { location: `${pathname}/` });
      res.end();
      return;
    }
    res.writeHead(404, { 'content-type': types['.html'] });
    fs.createReadStream(path.join(root, '404.html')).pipe(res);
  })
  .listen(port, () => console.log(`Serving ${root} on http://localhost:${port} (GitHub Pages style)`));
