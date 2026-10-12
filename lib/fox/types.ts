/** Wire types shared with megingjord's Find the Fox rooms (see megingjord FIND_THE_FOX.md). */

export interface RoomListing {
  roomId: string;
  /** Omitted for private rooms. */
  roomCode?: string;
  host: string;
  players: string[];
  inProgress: boolean;
  full: boolean;
  privateRoom: boolean;
}

/** megingjord's shared leaderboard service (utils/leaderboard.ts). Find the Fox keeps 1 entry per period. */
export interface LeaderEntry {
  name: string;
  points: number;
  at: number;
}

export interface LeaderboardPeriod {
  periodStart: string;
  entries: LeaderEntry[];
}

export interface Leaderboard {
  daily?: LeaderboardPeriod;
  weekly?: LeaderboardPeriod;
}

/** Megingjord's shared ChatEntry (`chat` broadcasts, `chat_history`). */
export interface ChatEntry {
  playerName: string;
  message: string;
  timestamp: number;
  type?: 'emoji';
}

/** Keep the same history size as the server. */
export const CHAT_HISTORY_LIMIT = 50;

export function appendChat(history: ChatEntry[] | null, entry: ChatEntry): ChatEntry[] {
  return [...(history ?? []), entry].slice(-CHAT_HISTORY_LIMIT);
}

export type ToastType = 'info' | 'moreInfo' | 'success' | 'error' | 'warning';

export interface Toast {
  title: string;
  message: string;
  type: ToastType;
  key?: string;
  [extra: string]: unknown;
}

/** Per-client private view sent by fox_game ("fox_secret"). */
export interface FoxSecret {
  isFox: boolean;
  keyWord: string;
  peekPlayer: string;
  peekClue: string;
  streamClue: boolean;
  myClue: string;
  myVote: string;
}

export const EMPTY_SECRET: FoxSecret = {
  isFox: false,
  keyWord: '',
  peekPlayer: '',
  peekClue: '',
  streamClue: false,
  myClue: '',
  myVote: '',
};

export interface HostPreferences {
  gridSelect: string;
  privateRoom: boolean;
  foxSeeClues: boolean;
  pointsForGuessing: boolean;
  anonymousVoting: boolean;
  clueTimer: boolean;
}

export type RoomOptionName = 'privateRoom' | 'foxSeeClues' | 'pointsForGuessing' | 'anonymousVoting' | 'clueTimer';

/** JSON form of megingjord's FoxState (room.state.toJSON()). */
export interface FoxStateJSON {
  roomCode: string;
  hostId: string;
  players: Record<string, { sessionId: string; playerName: string; score: number; isConnected: boolean; isBot: boolean }>;
  privateRoom: boolean;
  foxSeeClues: boolean;
  pointsForGuessing: boolean;
  anonymousVoting: boolean;
  clueTimer: boolean;
  gridSelect: string;
  gridTitle: string;
  grid: string[];
  inProgress: boolean;
  allCluesReady: boolean;
  boardIsClickable: boolean;
  fox: string;
  keyWord: string;
  foxPlayers: Record<
    string,
    { clue: string; clueReady: boolean; vote: string; hasVoted: boolean; foxCount: number; joinOrder: number }
  >;
}
