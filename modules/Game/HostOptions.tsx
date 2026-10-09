import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Row from 'react-bootstrap/Row';
import Tooltip from 'react-bootstrap/Tooltip';

import type { ChangeEvent } from 'react';

import type { GameState, RoomState } from '../../lib/fox/legacyView';
import type { RoomOptionName } from '../../lib/fox/types';
import { boardTitles as differentClueBoards } from '../../lib/fox/wordSheet';
import type { GameActions } from './actions';
import styles from './game.module.scss';

/**
 * start game/start round
 * kick player
 * change settings like board, etc
 * Can't change settings while a game is in progress.
 * In Progress goes to false everytime the round is over
 */
interface HostOptionsProps {
  actions: GameActions;
  roomState: RoomState;
  gameState: GameState;
  players: string[];
}

const HostOptions = ({ actions, roomState, gameState, players }: HostOptionsProps) => {
  const { gridSelect } = gameState;
  const { inProgress, pointsForGuessing, foxSeeClues, privateRoom, anonymousVoting, clueTimer } = roomState;
  const totalScore = players.reduce((prev, cur) => prev + roomState.players[cur], 0);
  const playedMoreThanOneRound = totalScore > 0;

  const startGame = () => {
    actions.startGame();
  };

  const resetScores = () => {
    actions.resetScores();
  };

  const kickPlayer = (playerName: string) => () => {
    actions.kickPlayer(playerName);
  };

  const changeGrid = (e: ChangeEvent<HTMLSelectElement>) => {
    actions.changeGrid(e.target.value);
  };

  const changeHostOption = (e: ChangeEvent<HTMLInputElement>) => {
    actions.changeRoomOption(e.target.name as RoomOptionName, e.target.checked);
  };

  const renderTooltip = (props: object) => {
    const message = players.length < 3 ? 'Need at least 3 players to start' : inProgress ? 'Game in progress' : '';

    if (message) {
      return (
        <Tooltip id="button-tooltip" {...props}>
          {message}
        </Tooltip>
      );
    }
    return <div />;
  };

  return (
    <section className={styles['host-options']}>
      <h4 className="marker">Host Options</h4>
      <Row>
        <Col>
          <OverlayTrigger placement="top" delay={{ show: 250, hide: 400 }} overlay={renderTooltip}>
            <div style={{ width: 'fit-content' }}>
              <Button onClick={startGame} disabled={inProgress || players.length < 3}>
                {playedMoreThanOneRound ? 'Next Round' : 'Start Game'}
              </Button>
            </div>
          </OverlayTrigger>
        </Col>
        <Col>
          <Button type="button" onClick={resetScores}>
            Reset Scores
          </Button>
        </Col>
      </Row>
      <br />
      <br />
      <Form onSubmit={(e) => e.preventDefault()}>
        <Form.Row>
          <Form.Group xs={12} sm={6} as={Col} controlId="gridBoard">
            <Form.Control as="select" value={gridSelect} onChange={changeGrid} name="gridSelect" disabled={inProgress}>
              <option value="random">Random Board</option>
              {differentClueBoards.map((title) => (
                <option key={title} value={title}>
                  {title}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
        </Form.Row>
        <Form.Row>
          <Form.Group as={Col} controlId="privateRoom">
            <Form.Check
              label="Private Game"
              name="privateRoom"
              onChange={changeHostOption}
              disabled={inProgress}
              checked={privateRoom}
            />
          </Form.Group>
        </Form.Row>
        <Form.Row>
          <Form.Group as={Col} controlId="pointsForGuessing">
            <Form.Check
              name="pointsForGuessing"
              disabled={inProgress}
              onChange={changeHostOption}
              checked={pointsForGuessing}
              label="1 point for guessing fox"
            />
          </Form.Group>
        </Form.Row>
        <Form.Row>
          <Form.Group as={Col} controlId="foxSeeClues">
            <Form.Check
              checked={foxSeeClues}
              onChange={changeHostOption}
              name="foxSeeClues"
              label="Fox can see one random player's clue"
            />
          </Form.Group>
        </Form.Row>
        <Form.Row>
          <Form.Group as={Col} controlId="anonymousVoting">
            <Form.Check
              label="Anonymous Voting"
              name="anonymousVoting"
              onChange={changeHostOption}
              checked={anonymousVoting}
            />
          </Form.Group>
        </Form.Row>
        <Form.Row>
          <Form.Group as={Col} controlId="clueTimer">
            <Form.Check
              label="1 min timer when thinking of clues"
              name="clueTimer"
              onChange={changeHostOption}
              checked={clueTimer}
            />
          </Form.Group>
        </Form.Row>
      </Form>
      <h5 className="marker">Click on player to kick:</h5>
      <div className={styles['kick-players']}>
        {players.map((player) => (
          <div
            className={styles['player-to-kick']}
            key={player}
            onClick={kickPlayer(player)}
            onKeyDown={kickPlayer(player)}
            role="button"
            tabIndex={0}
          >
            {player}
          </div>
        ))}
      </div>
    </section>
  );
};

export default HostOptions;
