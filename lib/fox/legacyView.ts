import type { FoxSecret, FoxStateJSON } from './types';

/**
 * The original fox-game UI was written against two name-keyed objects the
 * socket.io server pushed around (`roomState`, `gameState`). Megingjord keys
 * everything by session ID and keeps secrets out of shared state, so this
 * folds the synced state plus this player's private `fox_secret` back into
 * those shapes. The game components keep their original logic unchanged.
 */

export interface RoomState {
  id: string;
  host: string;
  /** player name -> score, in join order */
  players: Record<string, number>;
  inProgress: boolean;
  privateRoom: boolean;
  foxSeeClues: boolean;
  pointsForGuessing: boolean;
  anonymousVoting: boolean;
  clueTimer: boolean;
}

export interface GamePlayer {
  clue: string;
  clueReady: boolean;
  /** Name voted for, or a placeholder when the vote is hidden (anonymous voting shows a check mark). */
  vote: string;
}

export interface GameState {
  gridSelect: string;
  grid: string[];
  gridTitle: string;
  /** What this player may know of the keyword. */
  keyWord: string;
  /** Fox's name, when this player may know it. */
  fox: string;
  boardIsClickable: boolean;
  allCluesReady: boolean;
  /** Fox: whose clue it can watch. Peek target: its own name. Otherwise "". */
  playerShowsClue: string;
  players: Record<string, GamePlayer>;
}

const HIDDEN_VOTE = '✔';

export function toLegacyView(
  state: FoxStateJSON,
  secret: FoxSecret,
  mySessionId: string,
): { roomState: RoomState; gameState: GameState; username: string; sessionIdByName: Record<string, string> } {
  const nameOf = (sessionId: string) => state.players[sessionId]?.playerName ?? '';
  const username = nameOf(mySessionId);

  const players: Record<string, number> = {};
  const sessionIdByName: Record<string, string> = {};
  // Join order, not map order: a reconnect re-inserts the player's map entry.
  const order = (sessionId: string) => state.foxPlayers?.[sessionId]?.joinOrder ?? Number.MAX_SAFE_INTEGER;
  const ordered = Object.entries(state.players).sort(([a], [b]) => order(a) - order(b));
  for (const [sessionId, player] of ordered) {
    players[player.playerName] = player.score;
    sessionIdByName[player.playerName] = sessionId;
  }

  const gamePlayers: Record<string, GamePlayer> = {};
  for (const [sessionId, data] of Object.entries(state.foxPlayers ?? {})) {
    const name = nameOf(sessionId);
    if (!name) continue;
    const mine = sessionId === mySessionId;
    let clue = data.clue;
    if (mine && !state.allCluesReady) clue = secret.myClue;
    if (secret.peekPlayer === sessionId && !state.allCluesReady) clue = secret.peekClue;

    const voteTarget = mine && secret.myVote ? secret.myVote : data.vote;
    gamePlayers[name] = {
      clue,
      clueReady: data.clueReady,
      vote: voteTarget ? nameOf(voteTarget) : data.hasVoted ? HIDDEN_VOTE : '',
    };
  }

  const foxSessionId = state.fox || (secret.isFox ? mySessionId : '');
  const playerShowsClue = secret.peekPlayer ? nameOf(secret.peekPlayer) : secret.streamClue ? username : '';

  return {
    username,
    sessionIdByName,
    roomState: {
      id: state.roomCode,
      host: nameOf(state.hostId),
      players,
      inProgress: state.inProgress,
      privateRoom: state.privateRoom,
      foxSeeClues: state.foxSeeClues,
      pointsForGuessing: state.pointsForGuessing,
      anonymousVoting: state.anonymousVoting,
      clueTimer: state.clueTimer,
    },
    gameState: {
      gridSelect: state.gridSelect,
      grid: state.grid ?? [],
      gridTitle: state.gridTitle,
      keyWord: state.keyWord || secret.keyWord,
      fox: foxSessionId ? nameOf(foxSessionId) : '',
      boardIsClickable: state.boardIsClickable,
      allCluesReady: state.allCluesReady,
      playerShowsClue,
      players: gamePlayers,
    },
  };
}
