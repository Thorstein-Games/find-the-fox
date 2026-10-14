import path from 'path';

import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Fully static site (GitHub Pages / Netlify). The game itself runs on the
  // Megingjord server; nothing here needs a Node server. `next dev` is
  // unaffected.
  output: 'export',
  // e.g. "/find-the-fox" when served from a GitHub Pages project URL; empty at a domain root.
  basePath: process.env.NEXT_PUBLIC_BASE_PATH?.replace(/\/+$/, '') || undefined,
  // No trailing slashes (/lobby -> lobby.html, which GitHub Pages and Netlify
  // serve as /lobby). thorsteingames.com proxies /find-the-fox/* here, and its
  // Next.js strips trailing slashes; folder-style URLs would make GitHub Pages
  // redirect back to the slash form on github.io, off thorsteingames.com.
  trailingSlash: false,
  images: { unoptimized: true },
  reactStrictMode: false,
  sassOptions: {
    includePaths: [path.join(__dirname, 'node_modules')],
    // Bootstrap 4's SCSS predates Dart Sass 2.0 deprecations; keep the build log readable.
    quietDeps: true,
    silenceDeprecations: ['import', 'global-builtin', 'color-functions', 'slash-div', 'if-function'],
  },
};

export default nextConfig;
