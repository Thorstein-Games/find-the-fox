import Table from 'react-bootstrap/Table';

import type { GamePlayer, GameState, RoomState } from '../../lib/fox/legacyView';
import { obfuscateClue } from '../../utils';

import styles from './game.module.scss';

function getVote({
  allCluesReady,
  playerObj,
  anonymousVoting,
  inProgress,
}: {
  allCluesReady: boolean;
  playerObj: Partial<GamePlayer>;
  anonymousVoting: boolean;
  inProgress: boolean;
}) {
  if (anonymousVoting && allCluesReady && inProgress) {
    return playerObj.vote ? '\u2714' : '';
  }

  if (allCluesReady) {
    return playerObj.vote;
  }

  return null;
}

interface PlayersProps {
  roomState: RoomState;
  gameState: GameState;
  players: string[];
  allCluesReady: boolean;
  isFox: boolean;
}

const Players = ({ roomState, gameState, players, allCluesReady, isFox }: PlayersProps) => {
  const { inProgress, foxSeeClues, anonymousVoting } = roomState;
  const { playerShowsClue } = gameState;

  return (
    <section className={styles.players}>
      <Table responsive size="sm" borderless>
        <thead>
          <tr>
            <th>Player</th>
            <th>Score</th>
            <th>Word</th>
            <th>Ready</th>
            <th>Vote</th>
          </tr>
        </thead>
        <tbody>
          {players.map((player) => {
            const playerObj: Partial<GamePlayer> = gameState.players[player] || {};
            const clue = playerObj.clue || '';
            const foxClue =
              isFox && foxSeeClues && playerShowsClue === player
                ? playerObj.clueReady
                  ? clue
                  : obfuscateClue(clue)
                : null;

            return (
              <tr key={player} className={gameState.fox === player && !inProgress ? styles['player-fox'] : undefined}>
                <td>{player}</td>
                <td>{roomState.players[player]}</td>
                <td>{allCluesReady ? clue : foxClue}</td>
                <td>{playerObj?.clueReady && <span>&#10004;</span>}</td>
                <td>{getVote({ allCluesReady, playerObj, anonymousVoting, inProgress })}</td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    </section>
  );
};

export default Players;
