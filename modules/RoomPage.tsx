import { useEffect, useState } from 'react';

import Game from './Game';
import PageLayout from './PageLayout';
import { stripBasePath } from '../lib/fox/basePath';

/**
 * Room codes live in the path (/room/ABC123), as in sheeple-game. The page
 * is exported once as a client-rendered shell; static hosts serve it for any
 * code (GitHub Pages through 404.html, Netlify through public/_redirects),
 * so the code is read from the browser URL rather than build-time params.
 */
export function roomCodeFromPath(pathname: string): string | null {
  const match = /^\/room\/([A-Za-z0-9]+)\/?$/.exec(pathname);
  return match ? match[1].toUpperCase() : null;
}

export const RoomPage = () => {
  const [roomCode, setRoomCode] = useState<string | null>(null);

  useEffect(() => {
    setRoomCode(roomCodeFromPath(stripBasePath(window.location.pathname)));
  }, []);

  return <PageLayout>{roomCode ? <Game key={roomCode} roomCode={roomCode} /> : null}</PageLayout>;
};

