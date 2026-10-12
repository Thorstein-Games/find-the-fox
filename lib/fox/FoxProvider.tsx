import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import type { ReactNode } from 'react';

import { Client, type Room } from '@colyseus/sdk';
import { useRouter } from 'next/router';

import { FOX_GAME_ROOM, FOX_LOBBY_ROOM, getGameServerUrl } from './config';
import { getPlayerId, getStoredName, setStoredName } from './identity';
import { emitToast } from './toastBus';
import { appendChat, type ChatEntry, type HostPreferences, type Leaderboard, type RoomListing, type Toast } from './types';

/**
 * The site-wide connection: every tab stays joined to megingjord's single
 * `fox_lobby` room for its whole visit, which is what the original
 * socket.io connection did. It provides the claimed name, players online,
 * the lobby chat, the room list and the leaderboard, and it creates/joins
 * game rooms.
 */

interface FoxContextValue {
  client: Client | null;
  connected: boolean;
  username: string;
  playerId: string;
  playersOnline: string[];
  rooms: RoomListing[];
  leaderboard: Leaderboard | null;
  /** null until the lobby history arrives */
  lobbyChat: ChatEntry[] | null;
  /** Claim a name for this browser. Resolves to an error message, or null on success. */
  claimName: (name: string) => Promise<string | null>;
  /** Give up the current name (the player is choosing a new one). */
  releaseName: () => void;
  sendLobbyChat: (message: string, type?: 'emoji') => void;
  /** Look up a room by its code. */
  resolveCode: (code: string) => Promise<{ roomId: string; roomCode: string } | { error: string }>;
  createGame: (preferences: HostPreferences) => Promise<Room>;
  joinGame: (roomId: string, roomCode: string) => Promise<Room>;
}

const FoxContext = createContext<FoxContextValue | null>(null);

const RETRY_DELAYS_MS = [1000, 2000, 3000, 5000];

export const FoxProvider = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const [client, setClient] = useState<Client | null>(null);
  const [playerId, setPlayerId] = useState('');
  const [connected, setConnected] = useState(false);
  const [username, setUsername] = useState('');
  const [playersOnline, setPlayersOnline] = useState<string[]>([]);
  const [rooms, setRooms] = useState<RoomListing[]>([]);
  const [leaderboard, setLeaderboard] = useState<Leaderboard | null>(null);
  const [lobbyChat, setLobbyChat] = useState<ChatEntry[] | null>(null);

  const lobbyRef = useRef<Room | null>(null);
  const pendingClaim = useRef<((error: string | null) => void) | null>(null);
  const pendingResolves = useRef(new Map<number, (result: { roomId: string; roomCode: string } | { error: string }) => void>());
  const nextRequestId = useRef(1);
  const routerRef = useRef(router);
  routerRef.current = router;

  useEffect(() => {
    const id = getPlayerId();
    const colyseus = new Client(getGameServerUrl());
    setPlayerId(id);
    setClient(colyseus);

    let disposed = false;
    let attempt = 0;
    let retryTimer: ReturnType<typeof setTimeout> | null = null;

    const connect = async () => {
      try {
        const lobby = await colyseus.joinOrCreate(FOX_LOBBY_ROOM, { playerId: id, playerName: getStoredName() });
        if (disposed) {
          lobby.leave();
          return;
        }
        lobby.reconnection.enabled = false;
        attempt = 0;
        lobbyRef.current = lobby;
        setConnected(true);

        lobby.onMessage('lobby_state', (state: { rooms: RoomListing[]; playersOnline: string[]; leaderboard: Leaderboard }) => {
          setRooms(state.rooms);
          setPlayersOnline(state.playersOnline);
          setLeaderboard(state.leaderboard);
        });
        lobby.onMessage('rooms', setRooms);
        lobby.onMessage('players_online', setPlayersOnline);
        lobby.onMessage('leaderboard', setLeaderboard);
        lobby.onMessage('chat_history', ({ messages }: { messages: ChatEntry[] }) => setLobbyChat(messages));
        lobby.onMessage('chat', (entry: ChatEntry) => setLobbyChat((history) => appendChat(history, entry)));
        lobby.onMessage('toaster', (toast: Toast) => emitToast(toast));
        lobby.onMessage('name_accepted', ({ username: accepted }: { username: string }) => {
          setUsername(accepted);
          setStoredName(accepted);
          pendingClaim.current?.(null);
          pendingClaim.current = null;
        });
        lobby.onMessage('name_error', ({ error }: { error: string }) => {
          if (pendingClaim.current) {
            pendingClaim.current(error);
            pendingClaim.current = null;
            return;
          }
          // The automatic re-claim on connect failed: someone else has this name now.
          setUsername('');
          setStoredName('');
          emitToast({ title: 'error', message: 'User not found.  Redirecting to login', type: 'error', key: 'redirect' });
          if (routerRef.current.pathname !== '/') routerRef.current.push('/');
        });
        lobby.onMessage('code_resolved', (result: { requestId: number; roomId?: string; roomCode?: string; error?: string }) => {
          const resolve = pendingResolves.current.get(result.requestId);
          pendingResolves.current.delete(result.requestId);
          resolve?.(result.roomId ? { roomId: result.roomId, roomCode: result.roomCode ?? '' } : { error: result.error ?? 'Game not found' });
        });

        lobby.onLeave(() => {
          lobbyRef.current = null;
          setConnected(false);
          if (!disposed) scheduleRetry();
        });

        const storedName = getStoredName();
        if (storedName) setUsername(storedName);
      } catch (error) {
        console.error('Failed to connect to the game server:', error);
        setConnected(false);
        if (!disposed) scheduleRetry();
      }
    };

    const scheduleRetry = () => {
      const delay = RETRY_DELAYS_MS[Math.min(attempt, RETRY_DELAYS_MS.length - 1)];
      attempt += 1;
      retryTimer = setTimeout(connect, delay);
    };

    connect();

    return () => {
      disposed = true;
      if (retryTimer) clearTimeout(retryTimer);
      lobbyRef.current?.leave();
    };
  }, []);

  const claimName = useCallback(
    (name: string) =>
      new Promise<string | null>((resolve) => {
        const lobby = lobbyRef.current;
        if (!lobby) {
          resolve('Not connected to the game server yet. Please try again.');
          return;
        }
        pendingClaim.current?.('Cancelled');
        pendingClaim.current = resolve;
        lobby.send('claim_name', { name });
      }),
    [],
  );

  const releaseName = useCallback(() => {
    lobbyRef.current?.send('release_name');
    setUsername('');
    setStoredName('');
  }, []);

  const sendLobbyChat = useCallback((message: string, type?: 'emoji') => {
    lobbyRef.current?.send('chat', { text: message, type });
  }, []);

  const resolveCode = useCallback(
    (code: string) =>
      new Promise<{ roomId: string; roomCode: string } | { error: string }>((resolve) => {
        const lobby = lobbyRef.current;
        if (!lobby) {
          resolve({ error: 'Not connected to the game server' });
          return;
        }
        const requestId = nextRequestId.current++;
        pendingResolves.current.set(requestId, resolve);
        lobby.send('resolve_code', { requestId, code });
        setTimeout(() => {
          if (pendingResolves.current.delete(requestId)) resolve({ error: 'Game server did not respond' });
        }, 8000);
      }),
    [],
  );

  const createGame = useCallback(
    (preferences: HostPreferences) => {
      if (!client) return Promise.reject(new Error('Not connected'));
      return client.create(FOX_GAME_ROOM, { ...preferences, playerName: getStoredName(), playerId });
    },
    [client, playerId],
  );

  const joinGame = useCallback(
    (roomId: string, roomCode: string) => {
      if (!client) return Promise.reject(new Error('Not connected'));
      return client.joinById(roomId, { playerName: getStoredName(), playerId, roomCode });
    },
    [client, playerId],
  );

  const value = useMemo<FoxContextValue>(
    () => ({
      client,
      connected,
      username,
      playerId,
      playersOnline,
      rooms,
      leaderboard,
      lobbyChat,
      claimName,
      releaseName,
      sendLobbyChat,
      resolveCode,
      createGame,
      joinGame,
    }),
    [client, connected, username, playerId, playersOnline, rooms, leaderboard, lobbyChat, claimName, releaseName, sendLobbyChat, resolveCode, createGame, joinGame],
  );

  return <FoxContext.Provider value={value}>{children}</FoxContext.Provider>;
};

export function useFox(): FoxContextValue {
  const context = useContext(FoxContext);
  if (!context) throw new Error('useFox must be used within a FoxProvider');
  return context;
}

// Handoff from the lobby's "Host Game" to the room page, so the freshly
// created room's connection is reused instead of leaving and rejoining.
let pendingGameRoom: Room | null = null;

export function setPendingGameRoom(room: Room): void {
  pendingGameRoom = room;
}

export function takePendingGameRoom(roomCode: string, currentRoomCode: (room: Room) => string): Room | null {
  const room = pendingGameRoom;
  pendingGameRoom = null;
  if (room && currentRoomCode(room).toUpperCase() === roomCode.toUpperCase()) return room;
  room?.leave();
  return null;
}
