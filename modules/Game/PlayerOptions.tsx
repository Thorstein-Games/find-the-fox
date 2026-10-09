import { useEffect, useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

import type { GameState, RoomState } from '../../lib/fox/legacyView';
import Ellipsis from '../Ellipsis';
import type { GameActions } from './actions';
import CountdownGrid from './CountdownGrid';
import styles from './game.module.scss';

const getClue = (gameState: GameState, username: string) => {
  return gameState.players?.[username]?.clue || '';
};

interface PlayerOptionsProps {
  actions: GameActions;
  username: string;
  gameState: GameState;
  roomState: RoomState;
  players: string[];
  allCluesReady: boolean;
  isFox: boolean;
}

const PlayerOptions = ({ actions, username, gameState, roomState, players, allCluesReady, isFox }: PlayerOptionsProps) => {
  const { inProgress, foxSeeClues, clueTimer } = roomState;
  const [clue, setClue] = useState(() => getClue(gameState, username));
  const playerOptions = players.filter((player) => player !== username);
  const clueReady = gameState.players?.[username]?.clueReady || false;
  const showCountDown = clueTimer && !allCluesReady && inProgress;

  useEffect(() => {
    if (inProgress) {
      setClue(gameState.players?.[username]?.clue || '');
    }
  }, [inProgress]);

  const handleClueChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setClue(value);
    if (foxSeeClues && gameState.playerShowsClue === username) {
      actions.updateClue({ clue: value });
    }
  };

  const handleClueReady = (e?: FormEvent<HTMLFormElement>) => {
    if (e) {
      e.preventDefault();
    }
    if (allCluesReady) {
      return;
    }
    const nextClueReady = !clueReady;
    actions.updateClue({ clueReady: nextClueReady, clue });
  };

  const selectVote = (value: string) => {
    actions.vote(value);
  };

  const timeUp = () => {
    if (!clueReady) {
      actions.updateClue({ clueReady: true, clue: clue || 'Time ran out on me.' });
    }
  };

  if (gameState.boardIsClickable) {
    return (
      <div className={styles['player-options']}>
        <Alert style={{ color: 'rgb(50, 115, 153)' }}>
          <h2>
            {isFox ? 'Guess a word in the grid' : 'Fox is guessing a word'}
            <Ellipsis />
          </h2>
        </Alert>
      </div>
    );
  }

  if (!inProgress) {
    return (
      <div className={styles['player-options']}>
        <Alert style={{ color: 'rgb(106 47 47)' }}>
          <h2>
            Waiting for host to start game
            <Ellipsis />
          </h2>
        </Alert>
      </div>
    );
  }

  return (
    <div className={styles['player-options']}>
      {showCountDown && <CountdownGrid timeUp={timeUp} timer={60} />}
      <h4 className={styles['player-options__header']}>{allCluesReady ? "Who's the fox? Vote." : 'Enter your clue'}</h4>
      <Form onSubmit={handleClueReady}>
        {!allCluesReady && (
          <Form.Group controlId="clue" className={styles['player-options__clue-group']}>
            <div className={styles['player-options__clue-input-row']}>
              <Form.Control
                value={clue}
                disabled={allCluesReady || clueReady}
                name="clue"
                onChange={handleClueChange}
                className={styles['player-options__clue-input']}
              />
              <Button type="submit" disabled={allCluesReady} className={styles['player-options__submit']}>
                {clueReady ? 'Edit Clue' : 'Submit'}
              </Button>
            </div>
          </Form.Group>
        )}

        {allCluesReady && (
          <Form.Group controlId="vote" className={styles['player-options__vote-group']}>
            <div className={styles['player-options__vote-buttons']}>
              {playerOptions.map((player) => {
                const isSelected = gameState.players?.[username]?.vote === player;
                return (
                  <Button
                    key={player}
                    type="button"
                    onClick={() => selectVote(player)}
                    className={
                      isSelected
                        ? `${styles['player-options__vote-button']} ${styles['player-options__vote-button--selected']}`
                        : styles['player-options__vote-button']
                    }
                  >
                    <span className={styles['player-options__vote-name']}>{player}</span>
                    {isSelected && (
                      <span className={styles['player-options__vote-check']} aria-hidden="true">
                        <svg viewBox="0 0 16 16" role="img">
                          <path d="M6.2 11.2 2.9 7.9l-1.2 1.2 4.5 4.5 8.5-8.5-1.2-1.2z" />
                        </svg>
                      </span>
                    )}
                  </Button>
                );
              })}
            </div>
          </Form.Group>
        )}
      </Form>
    </div>
  );
};

export default PlayerOptions;
