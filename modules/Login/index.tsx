import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';

import { useFox } from '../../lib/fox/FoxProvider';
import { generateRandomPlayerName, getStoredName } from '../../lib/fox/identity';
import { Rules } from '../Game/GameRules';
import RecommendedAge from '../SVG/Age';
import Clock from '../SVG/Clock';
import Players from '../SVG/Players';
import styles from './login.module.scss';

/** Only follow same-site room links after login. */
function safeNext(next: unknown): string {
  return typeof next === 'string' && /^\/room\/[A-Za-z0-9]+\/?$/.test(next) ? next : '/lobby';
}

const Login = () => {
  const router = useRouter();
  const { claimName } = useFox();
  const [name, setName] = useState('');
  const [errorName, setErrorName] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setName(getStoredName() || generateRandomPlayerName());
  }, []);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    const error = await claimName(name);
    setSubmitting(false);
    if (error) {
      setErrorName(error);
      return;
    }
    router.push(safeNext(router.query.next));
  };

  return (
    <Container className={styles.wrapper}>
      <Image
        alt="Play Find the Fox, an online party game like The Chameleon"
        src="/banner.png"
        className={styles.banner}
        width={350}
        height={350}
      />
      <h1>Play Find the Fox</h1>
      <h2>The Online Hidden-Identity Party Game</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="user-name">
          <Form.Label>Player Name</Form.Label>
          <Form.Control
            value={name}
            onChange={(e) => setName(e.target.value)}
            type="text"
            size="lg"
            required
            placeholder="Please provide a name"
            maxLength={20}
            isInvalid={!!errorName}
          />
          {errorName && <Form.Text>{errorName}</Form.Text>}
        </Form.Group>
        <Button type="submit" variant="primary" disabled={submitting}>
          Enter Lobby
        </Button>
        <div className={styles.svgContainer}>
          <div className={styles.svgWrapper}>
            <Clock />
            <p>15 mins</p>
          </div>
          <div className={styles.svgWrapper}>
            <Players className={styles.svg} />
            <p>3 - 12 Players</p>
          </div>
          <div className={styles.svgWrapper}>
            <RecommendedAge className={styles.svg} />
            <p>Age 14+</p>
          </div>
        </div>
      </Form>
      <p>Cookies are required to play. 🍪</p>
      <Link href="/how-to-play">How to Play</Link>
      <br />
      <a href="https://find-the-fox.canny.io/feature-requests" target="_blank" rel="noopener noreferrer">
        Request a feature or report a bug
      </a>
      <br />
      <a href="https://patreon.com/ThorsteinGames" target="_blank" rel="noopener noreferrer">
        Support us on Patreon!
      </a>
      <section style={{ marginTop: 16 }}>
        <h2>The Rules</h2>
        <Rules />
      </section>
      <section>
        <h2>Disclaimer</h2>
        <p>
          Find the Fox is an independent, fan-made party game inspired by classic word and deduction games. It is not
          affiliated with or endorsed by any other company or product. All original artwork, code, and assets are the
          property of their respective creators. By using this site, you agree that cookies and ads may be used to
          support hosting and development costs.
        </p>
      </section>
    </Container>
  );
};

export default Login;
