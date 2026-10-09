import { memo } from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';

import type { RoomListing } from '../../lib/fox/types';
import PrivateSignup from './PrivateSignup';
import useJoinGame from './useJoinGame';

const cardStyles = { width: '18rem', margin: '20px 10px', color: 'white' };

function getStatus(room: RoomListing) {
  const { full, inProgress, privateRoom } = room;
  if (full) {
    return 'Full';
  }
  if (inProgress) {
    return 'In Progress';
  }
  if (privateRoom) {
    return 'Private and Waiting';
  }

  return 'Waiting';
}

const Room = ({ room }: { room: RoomListing }) => {
  const { host, full, inProgress, players, privateRoom } = room;
  const { joinOrToast, joining } = useJoinGame();
  const joinGame = () => {
    if (room.roomCode) joinOrToast(room.roomId, room.roomCode);
  };
  return (
    <Card bg="primary" style={cardStyles} className="mb-2">
      <Card.Header>Host: {host}</Card.Header>
      <Card.Body>
        <Card.Text>Players: {players.join(', ')}</Card.Text>
        <Card.Text>Status: {getStatus(room)}</Card.Text>
        {privateRoom && <PrivateSignup roomId={room.roomId} />}
        {full || inProgress || privateRoom ? null : (
          <Button variant="secondary" onClick={joinGame} disabled={joining}>
            Join Game
          </Button>
        )}
      </Card.Body>
    </Card>
  );
};

export default memo(Room);
