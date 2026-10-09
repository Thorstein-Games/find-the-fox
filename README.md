# Find the Fox

Blend in and don't get caught. [find-the-fox.com](https://find-the-fox.com)

This is a free online party game in the spirit of The Chameleon. One player is secretly **the fox**. Everyone else knows the secret word on the board. Each player gives a clue, then everyone votes on who the fox is.

## Scoring

- If the fox escapes undetected: fox +2, everyone else +0.
  - With "1 point for guessing fox" on, anyone who voted for the fox also gets +1.
- If the fox is caught but guesses the secret word: fox +1, everyone else +0.
- If the fox is caught and guesses wrong: fox +0, everyone else +1.

## How it's built

This repo is the **client only**: a static Next.js site (Pages Router, TypeScript, React 18, react-bootstrap / Bootstrap 4). The game runs on **[Megingjord](https://github.com/Thorstein-Games/megingjord)**, the shared Colyseus game server that also runs Sheeple. Its `FIND_THE_FOX.md` covers the rules engine and the wire protocol.

- **`fox_lobby`**: every tab stays connected to this site-wide room. It handles unique player names, "Players online", the lobby chat, the room list, the daily/weekly leaderboard and looking up a room by its code ([lib/fox/FoxProvider.tsx](lib/fox/FoxProvider.tsx)).
- **`fox_game`**: one room per game ([lib/fox/useFoxRoom.ts](lib/fox/useFoxRoom.ts)). The server never puts secrets in shared state. Each player privately receives what they're allowed to see: whether they're the fox, the keyword, and the peeked clue. [lib/fox/legacyView.ts](lib/fox/legacyView.ts) folds that into the shapes the game components were written against.
- Room links are `/room/<CODE>`, like Sheeple. The site is a static export. On GitHub Pages, unknown paths are served `404.html`, which renders the room for `/room/<CODE>`. On Netlify, [public/_redirects](public/_redirects) does the same.

This is a rebuild of the original socket.io `fox-game` repo, which is no longer updated. The UI and gameplay are unchanged.

## Developing

You need Node 22+, pnpm, and a Megingjord checkout next to this one (`../megingjord`).

```bash
# terminal 1: the game server on ws://localhost:2567
cd ../megingjord && pnpm install && pnpm dev

# terminal 2: this site on http://localhost:3000
pnpm install
pnpm dev
```

| Command | What it does |
|---|---|
| `pnpm dev` | Next dev server |
| `pnpm build` | Static export to `out/` |
| `pnpm preview` | Serve `out/` the way GitHub Pages does, including the `404.html` room fallback |
| `pnpm lint` / `pnpm typecheck` | ESLint / tsc |
| `pnpm test:e2e` | Build, then play real games with Playwright against `../megingjord` |

In development, Megingjord's `add_fake_player` bots play their own turns, so you can test a round alone.

The client talks to `ws://localhost:2567` on localhost and to `wss://megingjord.onrender.com` everywhere else. Set `NEXT_PUBLIC_GAME_SERVER_URL` at build time to override.

## Deploying (GitHub Pages)

`.github/workflows/deploy.yml` builds and publishes `out/` on every push to `main`. One-time setup:

1. **Settings → Pages → Source: GitHub Actions.**
2. **Settings → Pages → Custom domain:** `find-the-fox.com`. Then point DNS at GitHub Pages: apex `A`/`AAAA` records and a `www` `CNAME` to `thorstein-games.github.io`.
3. On the Megingjord deployment, add the site to the allowed origins, for example `CORS_ORIGIN=…,https://find-the-fox.com,https://www.find-the-fox.com`. Without this, browsers can't reach the matchmaker.
4. Optional: set a `GAME_SERVER_URL` repository variable to point the build at a different server.

Netlify also works with no changes: build with `pnpm build` and publish `out`.

The e2e workflow needs a `MEGINGJORD_PAT` secret with read access to Megingjord, the same setup as sheeple-game. Without it, the workflow skips with a warning.
