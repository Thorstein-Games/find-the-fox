import { useState } from 'react';
import type { FormEvent } from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import Row from 'react-bootstrap/Row';

import { useRouter } from 'next/router';

import { setPendingGameRoom, useFox } from '../../lib/fox/FoxProvider';
import { emitToast } from '../../lib/fox/toastBus';
import type { HostPreferences } from '../../lib/fox/types';
import { waitForRoomCode } from '../../lib/fox/useFoxRoom';
import { boardTitles as differentClueBoards } from '../../lib/fox/wordSheet';
import * as ga from '../../utils/ga';

const HostGame = ({ onHide, show }: { onHide: () => void; show: boolean }) => {
  const router = useRouter();
  const { createGame } = useFox();
  const [loading, setLoading] = useState(false);
  const hostRoom = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const preferences: HostPreferences = {
      gridSelect: String(formData.get('gridSelect')),
      privateRoom: formData.get('privateRoom') === 'on',
      foxSeeClues: formData.get('foxSeeClues') === 'on',
      pointsForGuessing: formData.get('pointsForGuessing') === 'on',
      anonymousVoting: formData.get('anonymousVoting') === 'on',
      clueTimer: formData.get('clueTimer') === 'on',
    };
    ga.event({
      action: 'host',
      params: { ...preferences },
    });
    try {
      const room = await createGame(preferences);
      const roomCode = await waitForRoomCode(room);
      setPendingGameRoom(room);
      router.push(`/room/${roomCode}`);
    } catch (error) {
      setLoading(false);
      emitToast({
        title: 'Error',
        message: error instanceof Error ? error.message : 'Could not create the game',
        type: 'error',
        key: 'hostFailed',
      });
    }
  };

  const onClose = () => {
    setLoading(false);
    onHide();
  };

  return (
    <Modal onHide={onClose} show={show} animation={false} aria-labelledby="host-preferences-title" centered>
      <Modal.Header closeButton>
        <Modal.Title id="host-preferences-title">Game Preferences</Modal.Title>
      </Modal.Header>
      <Form onSubmit={hostRoom}>
        <Modal.Body>
          <Form.Row>
            <Form.Group as={Col} controlId="gridBoard">
              <Form.Label>Clue Boards</Form.Label>
              <Form.Control as="select" defaultValue="Random Board" name="gridSelect">
                <option value="random">Random Board</option>
                {differentClueBoards.map((gridTitle) => (
                  <option key={gridTitle} value={gridTitle}>
                    {gridTitle}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
          </Form.Row>

          <Form.Group as={Row} controlId="privateRoom">
            <Col>
              <Form.Check label="Private Game" name="privateRoom" />
            </Col>
          </Form.Group>
          <Form.Group as={Row} controlId="foxSeeClues">
            <Col>
              <Form.Check defaultChecked name="foxSeeClues" label="Fox can see one random player's clue" />
            </Col>
          </Form.Group>
          <Form.Group as={Row} controlId="pointsForGuessing">
            <Col>
              <Form.Check
                name="pointsForGuessing"
                defaultChecked
                label="Player gets 1 point for guessing fox when not in majority"
              />
            </Col>
          </Form.Group>
          <Form.Group as={Row} controlId="anonymousVoting">
            <Col>
              <Form.Check name="anonymousVoting" label="Anonymous Voting" />
            </Col>
          </Form.Group>
          <Form.Group as={Row} controlId="clueTimer">
            <Col>
              <Form.Check name="clueTimer" label="Add a 1 min timer when adding a clue" />
            </Col>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button disabled={loading} type="submit">
            {loading ? 'Setting up game...' : 'Host Game'}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default HostGame;
