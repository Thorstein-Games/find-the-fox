import { useCallback, useState } from 'react';

import { useRouter } from 'next/router';

import { setPendingGameRoom, useFox } from '../../lib/fox/FoxProvider';
import { emitToast } from '../../lib/fox/toastBus';
import { waitForRoomCode } from '../../lib/fox/useFoxRoom';

/**
 * Join a listed room from the lobby, then hand the live connection to the
 * room page. Errors (full, wrong code) stay in the lobby, like the original.
 */
export default function useJoinGame() {
  const router = useRouter();
  const { joinGame } = useFox();
  const [joining, setJoining] = useState(false);

  const join = useCallback(
    async (roomId: string, roomCode: string): Promise<string | null> => {
      setJoining(true);
      try {
        const room = await joinGame(roomId, roomCode);
        const code = await waitForRoomCode(room);
        setPendingGameRoom(room);
        router.push(`/room/${code}`);
        return null;
      } catch (error) {
        return error instanceof Error ? error.message : 'Could not join the game';
      } finally {
        setJoining(false);
      }
    },
    [joinGame, router],
  );

  const joinOrToast = useCallback(
    async (roomId: string, roomCode: string) => {
      const error = await join(roomId, roomCode);
      if (error) emitToast({ title: 'Error', message: error, type: 'error', key: 'joinFailed' });
    },
    [join],
  );

  return { join, joinOrToast, joining };
}
