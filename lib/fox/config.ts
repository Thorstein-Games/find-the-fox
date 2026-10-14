export const FOX_LOBBY_ROOM = 'fox_lobby';
export const FOX_GAME_ROOM = 'fox_game';
export const MIN_PLAYERS = 3;

const isProd = process.env.NODE_ENV === 'production';

export const siteConfig = {
  development: !isProd,
  ga: isProd ? 'G-PKG6DHM8QM' : '',
  url: isProd ? 'https://www.find-the-fox.com' : 'http://localhost:3000',
};

/** Megingjord game server: local in development, the shared deployment otherwise. */
export function getGameServerUrl(): string {
  if (process.env.NEXT_PUBLIC_GAME_SERVER_URL) {
    return process.env.NEXT_PUBLIC_GAME_SERVER_URL;
  }
  const isLocal =
    typeof window !== 'undefined'
      ? ['localhost', '127.0.0.1'].includes(window.location.hostname)
      : process.env.NODE_ENV !== 'production';
  return isLocal ? 'ws://localhost:2567' : 'wss://megingjord.onrender.com';
}
