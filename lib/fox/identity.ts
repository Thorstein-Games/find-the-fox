/**
 * Browser identity. `playerId` is a persistent random id the server uses to
 * know a name belongs to this browser; `playerName` is the claimed name
 * (the original game kept it in a cookie).
 */
const PLAYER_ID_KEY = 'playerId';
const PLAYER_NAME_KEY = 'playerName';

function storage(): Storage | null {
  try {
    return typeof window === 'undefined' ? null : window.localStorage;
  } catch {
    return null;
  }
}

export function getPlayerId(): string {
  const store = storage();
  if (!store) return '';
  let id = store.getItem(PLAYER_ID_KEY);
  if (!id) {
    id = `player_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 12)}`;
    store.setItem(PLAYER_ID_KEY, id);
  }
  return id;
}

export function getStoredName(): string {
  return storage()?.getItem(PLAYER_NAME_KEY) ?? '';
}

export function setStoredName(name: string): void {
  if (name) storage()?.setItem(PLAYER_NAME_KEY, name);
  else storage()?.removeItem(PLAYER_NAME_KEY);
}

export const generateRandomPlayerName = () => `Player${Date.now().toString().slice(-6)}`;
