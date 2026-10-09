import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import FormControl from 'react-bootstrap/FormControl';
import FormText from 'react-bootstrap/FormText';
import InputGroup from 'react-bootstrap/InputGroup';

import useJoinGame from './useJoinGame';

const PrivateSignup = ({ roomId }: { roomId: string }) => {
  const [id, setId] = useState('');
  const [error, setError] = useState('');
  const { join, joining } = useJoinGame();

  // The code is checked by the server now (the original compared it in the browser).
  const verifySubmit = async () => {
    setError('');
    const joinError = await join(roomId, id.trim());
    if (joinError) {
      setError(/incorrect/i.test(joinError) ? 'Incorrect game id' : joinError);
    }
  };

  return (
    <>
      <InputGroup className="mb-3">
        <FormControl
          onChange={(e) => setId(e.target.value)}
          placeholder="Type in game id"
          aria-label="Game ID"
          aria-describedby="basic-addon2"
        />
        <InputGroup.Append>
          <Button onClick={verifySubmit} variant="secondary" disabled={joining}>
            Join Game
          </Button>
        </InputGroup.Append>
      </InputGroup>
      {error && <FormText style={{ color: 'black' }}>{error}</FormText>}
    </>
  );
};

export default PrivateSignup;
