import { useEffect, useState } from 'react';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';

import Link from 'next/link';

import { useFox } from '../../lib/fox/FoxProvider';
import { generateRandomPlayerName, getStoredName } from '../../lib/fox/identity';
import Header from '../Header';
import Toasts from '../Toasts';
import HostGame from './HostGame';
import Leaderboard from './Leaderboard';
import Room from './Room';
import styles from './lobby.module.scss';

const Lobby = () => {
  const { connected, username, rooms, claimName, releaseName } = useFox();
  const [showHostModal, setShowHostModal] = useState(false);

  // The original lobby gave cookie-less visitors a random name; do the same (and claim it).
  useEffect(() => {
    if (connected && !getStoredName()) {
      claimName(generateRandomPlayerName());
    }
  }, [connected]);

  const hostGame = () => {
    setShowHostModal(true);
  };

  const handleEditClick = () => releaseName();

  const joinAGameArray = rooms.filter((room) => !room.inProgress && !room.full);
  const inProgressGames = rooms.filter((room) => room.inProgress);

  return (
    <>
      <Header showConnection showPlayersOnline />
      <Toasts />
      <Container className={styles['lobby-wrapper']}>
        <h3 className="h1">
          {username || getStoredName()}{' '}
          <Link href="/" onClick={handleEditClick} onKeyDown={handleEditClick}>
            &#9998;
          </Link>
        </h3>
        <div className={styles['host-game']}>
          <Button onClick={hostGame}>Host Game</Button>
          <HostGame show={showHostModal} onHide={() => setShowHostModal(false)} />
        </div>
        <Leaderboard />
        {rooms.length > 0 ? (
          <>
            <h3>Join a Game</h3>
            <div className={styles.grid}>
              {joinAGameArray.map((room) => (
                <Room key={room.roomId} room={room} />
              ))}
            </div>
            <br />
            <h3>Games in Progress</h3>
            <div className={styles.grid}>
              {inProgressGames.map((room) => (
                <Room key={room.roomId} room={room} />
              ))}
            </div>
          </>
        ) : (
          <Alert variant="warning">There are no games. Host one :)</Alert>
        )}
      </Container>
    </>
  );
};

export default Lobby;
