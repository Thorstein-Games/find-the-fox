import { useCallback, useEffect, useRef, useState } from 'react';

import { CloseCode, type Room } from '@colyseus/sdk';
import { useRouter } from 'next/router';

import { takePendingGameRoom, useFox } from './FoxProvider';
import { getStoredName } from './identity';
import { emitToast } from './toastBus';
import { EMPTY_SECRET, appendChat, type ChatEntry, type FoxSecret, type FoxStateJSON, type Toast } from './types';

const REJOIN_DELAYS_MS = [500, 1000, 2000, 3000, 5000];
const MAX_REJOIN_ATTEMPTS = 20;

/** Base-room messages the fox UI doesn't use; registered so the SDK doesn't warn about them. */
const IGNORED_MESSAGES = [
  'welcome',
  'player_list',
  'player_joined',
  'player_reconnected',
  'player_disconnected',
  'player_removed',
  'spectator_joined',
  'spectator_left',
  'pong',
];

export function roomCodeOf(room: Room): string {
  return ((room.state as { roomCode?: string } | undefined)?.roomCode ?? '').toUpperCase();
}

/** Resolves once the room's first state snapshot (and so its code) has arrived. */
export function waitForRoomCode(room: Room): Promise<string> {
  if (roomCodeOf(room)) return Promise.resolve(roomCodeOf(room));
  return new Promise((resolve) => room.onStateChange.once(() => resolve(roomCodeOf(room))));
}

export interface FoxRoomConnection {
  state: FoxStateJSON | null;
  secret: FoxSecret;
  /** null until the room's chat history arrives */
  chat: ChatEntry[] | null;
  sessionId: string;
  connected: boolean;
  send: (type: string, payload?: unknown) => void;
  leave: () => void;
}

/**
 * Join (or adopt the just-created) game room for `roomCode` and keep its
 * state, private view and chat in React state. A dropped connection rejoins
 * by name, which megingjord treats as a reconnect (seat, score and round
 * role are kept).
 */
export function useFoxRoom(roomCode: string): FoxRoomConnection {
  const router = useRouter();
  const { connected: lobbyConnected, resolveCode, joinGame } = useFox();
  const [state, setState] = useState<FoxStateJSON | null>(null);
  const [secret, setSecret] = useState<FoxSecret>(EMPTY_SECRET);
  const [chat, setChat] = useState<ChatEntry[] | null>(null);
  const [sessionId, setSessionId] = useState('');
  const [connected, setConnected] = useState(false);

  const roomRef = useRef<Room | null>(null);
  const roomIdRef = useRef('');
  const leavingRef = useRef(false);
  const startedRef = useRef(false);
  const rejoinRef = useRef<(attempt: number) => void>(() => {});
  const routerRef = useRef(router);
  routerRef.current = router;

  const goToLobby = useCallback((toast?: Toast) => {
    leavingRef.current = true;
    // Toast once the lobby is showing, so it isn't dropped with this page.
    routerRef.current.push('/lobby').finally(() => {
      if (toast) emitToast(toast);
    });
  }, []);

  const adopt = useCallback(
    (room: Room) => {
      roomRef.current = room;
      roomIdRef.current = room.roomId;
      room.reconnection.enabled = false;
      let kickedToast: Toast | null = null;

      IGNORED_MESSAGES.forEach((type) => room.onMessage(type, () => {}));
      room.onMessage('fox_secret', (next: FoxSecret) => setSecret(next));
      room.onMessage('chat_history', ({ messages }: { messages: ChatEntry[] }) => setChat(messages));
      room.onMessage('chat', (entry: ChatEntry) => setChat((history) => appendChat(history, entry)));
      room.onMessage('toaster', (toast: Toast) => emitToast(toast));
      room.onMessage('error', ({ message }: { message: string }) =>
        emitToast({ title: 'Error', message, type: 'error' }),
      );
      room.onMessage('host_changed', ({ newHostId }: { newHostId: string }) => {
        const newHost = (room.state as { players?: Map<string, { playerName: string }> }).players?.get(newHostId);
        emitToast({
          title: 'Host Left',
          message: `A new host has been assigned: ${newHost?.playerName ?? ''}`,
          type: 'moreInfo',
          key: 'hostLeft',
        });
      });
      room.onMessage('kicked', () => {
        kickedToast = {
          title: 'Kicked from Room',
          message: 'You have been kicked from the room by the host',
          type: 'info',
          key: 'playerKicked',
        };
      });

      const sync = () => setState((room.state as { toJSON(): FoxStateJSON }).toJSON());
      room.onStateChange(sync);
      if (roomCodeOf(room)) sync();

      room.onLeave((code: number) => {
        setConnected(false);
        if (roomRef.current === room) roomRef.current = null;
        if (kickedToast) {
          goToLobby(kickedToast);
          return;
        }
        if (leavingRef.current || code === CloseCode.CONSENTED) return;
        rejoinRef.current(0);
      });

      setSessionId(room.sessionId);
      setConnected(true);
      room.send('client_ready');
    },
    [goToLobby],
  );

  const rejoin = useCallback(
    (attempt: number) => {
      if (leavingRef.current) return;
      if (attempt >= MAX_REJOIN_ATTEMPTS) {
        goToLobby({ title: 'Room Closed', message: 'Lost connection to the game.', type: 'moreInfo', key: 'roomClosed' });
        return;
      }
      const delay = REJOIN_DELAYS_MS[Math.min(attempt, REJOIN_DELAYS_MS.length - 1)];
      setTimeout(async () => {
        if (leavingRef.current) return;
        try {
          adopt(await joinGame(roomIdRef.current, roomCode));
        } catch (error) {
          const message = error instanceof Error ? error.message : String(error);
          // The room is gone (everyone left, or a server restart lost it for good).
          if (/not found|disposed|locked/i.test(message)) {
            goToLobby({ title: 'Room Closed', message: '', type: 'moreInfo', key: 'roomClosed' });
            return;
          }
          rejoin(attempt + 1);
        }
      }, delay);
    },
    [adopt, goToLobby, joinGame, roomCode],
  );
  rejoinRef.current = rejoin;

  // Initial join, once the code and the lobby connection are available.
  useEffect(() => {
    if (!roomCode || startedRef.current) return;

    const pending = takePendingGameRoom(roomCode, roomCodeOf);
    if (pending) {
      startedRef.current = true;
      adopt(pending);
      return;
    }

    if (!getStoredName()) {
      // New visitor from a shared link: pick a name first, then come back.
      startedRef.current = true;
      routerRef.current.replace(`/?next=${encodeURIComponent(`/room/${roomCode}`)}`);
      return;
    }
    if (!lobbyConnected) return;

    startedRef.current = true;
    (async () => {
      const resolved = await resolveCode(roomCode);
      if ('error' in resolved) {
        goToLobby({ title: 'Room Closed', message: resolved.error, type: 'moreInfo', key: 'roomClosed' });
        return;
      }
      roomIdRef.current = resolved.roomId;
      try {
        adopt(await joinGame(resolved.roomId, resolved.roomCode));
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Could not join the game';
        goToLobby({ title: 'Error', message, type: 'error', key: 'joinFailed' });
      }
    })();
  }, [roomCode, lobbyConnected]);

  // Leave the room when the page unmounts (navigating away), like the original "leaveRoom".
  useEffect(
    () => () => {
      leavingRef.current = true;
      roomRef.current?.leave(true);
      roomRef.current = null;
    },
    [],
  );

  const send = useCallback((type: string, payload?: unknown) => {
    roomRef.current?.send(type, payload);
  }, []);

  const leave = useCallback(() => {
    leavingRef.current = true;
    roomRef.current?.leave(true);
  }, []);

  return { state, secret, chat, sessionId, connected, send, leave };
}
