# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

This is the static Next.js (Pages Router) client for Find the Fox. It connects over WebSocket (`@colyseus/sdk` 0.17, matching the server) to the `megingjord` Colyseus game server, a separate repo that holds all the game logic. There is no server code here. `next build` is a static export (`output: 'export'`) deployed to GitHub Pages.

The UI is a port of the original socket.io `fox-game` repo (no longer updated). Keep it looking and behaving the same. In particular, keep React 18 + react-bootstrap 1.x + Bootstrap 4 SCSS: moving to React 19 or Bootstrap 5 changes markup and looks.

## Commands

```bash
pnpm dev          # next dev (needs ../megingjord running: cd ../megingjord && pnpm dev)
pnpm build        # static export to out/
pnpm preview      # serve out/ like GitHub Pages (404.html fallback for /room/<code>)
pnpm lint         # eslint
pnpm typecheck    # tsc --noEmit
pnpm test:e2e     # build + Playwright against ../megingjord (boots it via playwright.config.ts)
```

## Architecture

- **`lib/fox/FoxProvider.tsx`**: one app-wide connection to megingjord's `fox_lobby` room (a site-wide singleton). It covers name claims (unique site-wide, owned by a persistent `playerId` in localStorage), players online, lobby chat, the room list, the leaderboard and room-code resolution. It also creates/joins `fox_game` rooms and hands a fresh room to the room page (`setPendingGameRoom`).
- **`lib/fox/useFoxRoom.ts`**: game room connection. State is `room.state.toJSON()`. The private per-player `fox_secret` message carries the fox flag, keyword, peek clue, own clue and own vote. A dropped connection rejoins by name, which megingjord's BaseGameRoom treats as a reconnect. SDK token reconnection is disabled because megingjord doesn't support it.
- **`lib/fox/legacyView.ts`**: folds server state (keyed by session ID) plus the secret into the original name-keyed `roomState`/`gameState` shapes the `modules/Game` components use.
- **Routing**: room URLs are `/room/<CODE>`. `pages/room/[roomCode].tsx` and `pages/404.tsx` both render `modules/RoomPage.tsx`, which reads the code from `window.location`. Static hosts serve 404.html for unknown paths, and Netlify has `public/_redirects`.
- **Toasts**: everything goes through `lib/fox/toastBus.ts`. Toasts emitted while no `<Toasts>` is mounted (mid-navigation) are held for the next one.
- `lib/fox/wordSheet.ts` mirrors megingjord's `src/games/find-the-fox/wordSheet.ts`. Keep them in sync.

## Cross-repo notes

Message names and payloads are defined server-side: see megingjord's `FIND_THE_FOX.md` and `src/rooms/FoxRoom.ts` / `FoxLobbyRoom.ts`. When changing the protocol, change both repos. The e2e workflow tests against the megingjord branch with the same name when one exists.
