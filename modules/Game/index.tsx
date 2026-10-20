import { useEffect, useMemo } from 'react';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';

import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';

import { useFox } from '../../lib/fox/FoxProvider';
import { toLegacyView } from '../../lib/fox/legacyView';
import type { Toast } from '../../lib/fox/types';
import { useFoxRoom } from '../../lib/fox/useFoxRoom';
import Chat from '../Chat';
import Header from '../Header';
import Toasts from '../Toasts';
import GameId from './GameId';
import GameRules from './GameRules';
import GridOfWords from './GridOfWords';
import HostOptions from './HostOptions';
import PlayersGrid from './PlayersGrid';
import type { GameActions } from './actions';
import styles from './game.module.scss';

const PlayerOptions = dynamic(() => import('./PlayerOptions'), { ssr: false });

const leaveMessage = 'The game is in progress. Are you sure you want to leave?';

const throwConfetti = async () => {
  const party = await import('party-js');
  let times = 0;
  const interval = setInterval(() => {
    party.confetti(document.body, {
      count: 100,
    });
    times++;
    if (times === 2) {
      clearInterval(interval);
    }
  }, 2000);
};

const Game = ({ roomCode }: { roomCode: string }) => {
  const router = useRouter();
  const { username: claimedName } = useFox();
  const { state, secret, chat, sessionId, connected, send } = useFoxRoom(roomCode);

  const view = useMemo(() => (state ? toLegacyView(state, secret, sessionId) : null), [state, secret, sessionId]);
  const inProgress = view?.roomState.inProgress ?? false;

  useEffect(() => {
    const onUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = leaveMessage;
      return leaveMessage;
    };
    if (inProgress) {
      window.addEventListener('beforeunload', onUnload, { capture: true });
    }
    return () => {
      window.removeEventListener('beforeunload', onUnload, { capture: true });
    };
  }, [inProgress]);

  const actions = useMemo<GameActions>(() => {
    const idOf = (name: string) => view?.sessionIdByName[name] ?? '';
    return {
      startGame: () => send('start_game'),
      resetScores: () => send('reset_scores'),
      kickPlayer: (name) => send('kick_player', { sessionId: idOf(name) }),
      changeGrid: (gridSelect) => send('change_grid', { gridSelect }),
      changeRoomOption: (name, value) => send('change_room_option', { name, value }),
      updateClue: (update) => send('update_clue', update),
      vote: (name) => send('vote', { target: idOf(name) }),
      foxGuess: (word) => send('fox_guess', { word }),
    };
  }, [send, view]);

  const leaveRoom = () => {
    router.push('/lobby');
  };

  const promptLeave = () => {
    if (!inProgress) {
      leaveRoom();
    } else if (window.confirm(leaveMessage)) {
      leaveRoom();
    }
  };

  const username = view?.username || claimedName;
  const isFox = !!view && username === view.gameState.fox;

  const handleToasts = (toast: Toast) => {
    switch (toast.key) {
      case 'wrongWord': {
        if (!isFox) {
          throwConfetti();
        }
        break;
      }
      case 'correctWord':
      case 'foxEscaped': {
        if (isFox) {
          throwConfetti();
        }
        break;
      }
      default:
        break;
    }
  };

  if (!view) {
    return (
      <>
        <Header showConnection connected={connected} />
        <Toasts />
      </>
    );
  }

  const { roomState, gameState } = view;
  const players = Object.keys(roomState.players);
  const allCluesReady = gameState.allCluesReady;
  const isHost = username === roomState.host;

  return (
    <>
      <Header showConnection connected={connected}>
        <button type="button" onClick={promptLeave} className={styles['leave-room']}>
          &#8592; Leave Room
        </button>
        <GameId roomId={roomState.id} />
      </Header>
      <Toasts callback={handleToasts} />
      <div className={styles.relative}>
        <Container>
          <Row>
            <Col>
              <PlayersGrid
                gameState={gameState}
                players={players}
                roomState={roomState}
                allCluesReady={allCluesReady}
                isFox={isFox}
              />
            </Col>
            <GridOfWords actions={actions} gameState={gameState} inProgress={inProgress} isFox={isFox} />
          </Row>
          <Row>
            <Col>
              <PlayerOptions
                actions={actions}
                username={username}
                roomState={roomState}
                gameState={gameState}
                players={players}
                allCluesReady={allCluesReady}
                isFox={isFox}
              />
            </Col>
          </Row>
          <Row>
            <Col>
              {isHost && <HostOptions actions={actions} roomState={roomState} gameState={gameState} players={players} />}
              {!isHost && <GameRules roomState={roomState} />}
            </Col>
          </Row>
          {!inProgress && (
            <Row>
              <Col>
                <tg-more-games game="find-the-fox" className={styles['more-games']} />
                <tg-ad game="find-the-fox" format="box" className={styles['round-ad']} />
              </Col>
            </Row>
          )}
        </Container>
      </div>
      <Chat headerName={roomState.id} playerName={username} messages={chat} onSend={(message, type) => send('chat', { text: message, type })} />
    </>
  );
};

export default Game;
