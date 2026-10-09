import { useState } from 'react';

import type { RoomState } from '../../lib/fox/legacyView';
import styles from './game.module.scss';

const Check = ({ label, checked }: { label: string; checked: boolean }) => (
  <div>
    {label}: &nbsp; {checked ? 'YES' : 'NO'}
  </div>
);

export const Rules = () => (
  <div style={{ fontSize: 14, lineHeight: 1.4 }}>
    <ol style={{ paddingLeft: 16 }}>
      <li>
        A secret target word is chosen from the shared grid. Everyone sees the grid; only non-fox players know the exact
        word.
      </li>
      <li>The fox is trying to blend in and avoid being identified while working out the secret word.</li>
      <li>
        Each non-fox player writes a short clue: specific enough to signal knowledge to teammates, vague enough not to
        hand the answer to the fox.
      </li>
      <li>
        The fox gives a bluff clue based only on the visible grid and previous clues (or stays ambiguous) to avoid
        suspicion.
      </li>
      <li>
        After clues, players discuss briefly, then vote on who they think the fox is. (Anonymous option if enabled.)
      </li>
      <li>
        If the fox is not caught, or correctly guesses the word after being caught (depending on variant), they score.
        Otherwise the group scores.
      </li>
      <li>Keep clues short, avoid direct synonyms, numbers or letters that blatantly point to the answer.</li>
    </ol>
  </div>
);

const GameRules = ({ roomState }: { roomState: RoomState }) => {
  const { pointsForGuessing, foxSeeClues, privateRoom, anonymousVoting, clueTimer } = roomState;
  const [showRules, setShowRules] = useState(false);
  return (
    <>
      <section className={styles['host-options']}>
        <h4 className="marker">Game Options</h4>
        <Check checked={pointsForGuessing} label="1 point for guessing fox" />
        <Check checked={foxSeeClues} label="Fox can see one random player's clue" />
        <Check label="Anonymous Voting" checked={anonymousVoting} />
        <Check label="1 minute timer" checked={clueTimer} />
        <Check label="Private Game" checked={privateRoom} />
      </section>
      <section className={styles['host-options']} style={{ marginTop: 12 }}>
        <button
          type="button"
          onClick={() => setShowRules((v) => !v)}
          className={styles['leave-room']}
          style={{ fontSize: 14, padding: '4px 8px', marginBottom: showRules ? 8 : 0 }}
        >
          {showRules ? 'Hide' : 'Show'} How To Play
        </button>
        {showRules && (
          <>
            <h4 className="marker" style={{ marginTop: 0 }}>
              General Rules
            </h4>
            <Rules />
          </>
        )}
      </section>
    </>
  );
};

export default GameRules;
