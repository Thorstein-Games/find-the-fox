import type { RoomOptionName } from '../../lib/fox/types';

/** What the game components can ask the server to do (the original emitted these over socket.io). */
export interface GameActions {
  startGame: () => void;
  resetScores: () => void;
  kickPlayer: (playerName: string) => void;
  changeGrid: (gridSelect: string) => void;
  changeRoomOption: (name: RoomOptionName, value: boolean) => void;
  updateClue: (update: { clue?: string; clueReady?: boolean }) => void;
  vote: (playerName: string) => void;
  foxGuess: (word: string) => void;
}
