import { useEffect, useMemo, useState } from 'react';
import Collapse from 'react-bootstrap/Collapse';
import Table from 'react-bootstrap/Table';

import useIsMobile from '../../hooks/useIsMobile';
import type { GameState } from '../../lib/fox/legacyView';
import type { GameActions } from './actions';
import CountdownGrid from './CountdownGrid';
import styles from './game.module.scss';

function getGridSubTitle(keyWord: string, gameState: GameState, isFox: boolean) {
  if (isFox && gameState.boardIsClickable) {
    return 'Guess/Select a word below';
  }
  if (isFox) {
    return 'You are the FOX! Blend in.';
  }

  if (!keyWord || keyWord === '') {
    return '...';
  }

  return `Keyword: ${keyWord}`;
}

const toMatrix = (arr: string[] = [], width = 4) => {
  const rows: string[][] = [];
  arr.forEach((key, index) => {
    if (index % width === 0) rows.push([key]);
    else rows[rows.length - 1].push(key);
  });
  return rows;
};

const gameColumns = ['', 'A', 'B', 'C', 'D'];
const gameColumnsMobile = ['A', 'B', 'C', 'D'];

interface GridOfWordsProps {
  actions: GameActions;
  gameState: GameState;
  isFox: boolean;
  inProgress: boolean;
}

const GridOfWords = ({ actions, gameState, isFox, inProgress }: GridOfWordsProps) => {
  const { grid, gridTitle, keyWord, boardIsClickable } = gameState;
  const isMobile = useIsMobile();
  const [showTable, setShowTable] = useState(true);
  const [hasSubmittedGuess, setHasSubmittedGuess] = useState(false);
  const fourByFour = useMemo(() => toMatrix(grid, 4), [grid]);
  const tableHeaders = isMobile ? gameColumnsMobile : gameColumns;
  const canClickCells = boardIsClickable && isFox && inProgress && !hasSubmittedGuess;

  useEffect(() => {
    if (!boardIsClickable) {
      setHasSubmittedGuess(false);
    }
  }, [boardIsClickable]);

  const handleCellClick = (word: string) => async () => {
    if (!canClickCells) {
      return;
    }

    setHasSubmittedGuess(true);
    actions.foxGuess(word);

    if (word === keyWord) {
      import('party-js')
        .then((party) => {
          const clueTable = document.getElementById('clue-table');
          if (!clueTable) {
            return;
          }
          party.sparkles(clueTable, {
            count: 100,
          });
        })
        .catch(() => {});
    }
  };

  const timeUp = () => {
    if (!canClickCells) {
      return;
    }
    setHasSubmittedGuess(true);
    actions.foxGuess('RAN OUT OF TIME!');
  };

  return (
    <section className={styles['grid-of-words']}>
      <div className={styles['table-title']}>
        {canClickCells && <CountdownGrid timeUp={timeUp} />}
        {isMobile && (
          <button
            onClick={() => setShowTable(!showTable)}
            aria-controls="clue-table"
            aria-expanded={showTable}
            type="button"
            title={showTable ? 'Collapse table' : 'Show table'}
            className={`${styles['arrow-collapse']} ${showTable ? styles.upsideDown : ''}`}
          >
            &#x25BC;
          </button>
        )}
        <h2>{gridTitle}</h2>
        <h5>{getGridSubTitle(keyWord, gameState, isFox)}</h5>
      </div>
      <Collapse in={showTable}>
        <div>
          <Table variant="light" className={styles['grid-table']} id="clue-table">
            <thead>
              <tr>
                {tableHeaders.map((col, i) => (
                  <th key={i}>{col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {fourByFour.map((matrix, i) => (
                <tr key={i}>
                  {!isMobile && <td className={styles['table-vertical']}>{i + 1}</td>}
                  {matrix.map((word) => (
                    <td
                      onClick={handleCellClick(word)}
                      key={word}
                      className={`${keyWord === word && (!isFox || !inProgress) ? styles['key-word'] : ''} ${
                        canClickCells ? styles['glowing-cells'] : ''
                      }`}
                    >
                      {word}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </Collapse>
    </section>
  );
};

export default GridOfWords;
