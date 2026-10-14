import Link from 'next/link';

import PageLayout from '../modules/PageLayout';
import styles from '../styles/content-page.module.scss';

const FAQ = () => {
  return (
    <PageLayout
      title="Chameleon Game Online FAQ"
      description="Answers about Find the Fox, the chameleon game online: how to play chameleon online with friends, players, rules and troubleshooting."
      url="/faq"
    >
      <div className={styles.container}>
        <div className={styles.content}>
          <h1>Frequently Asked Questions</h1>

          <section className={styles.section}>
            <h2>Getting Started</h2>

            <div className={styles.faqItem}>
              <h3>Can I play The Chameleon online?</h3>
              <p>
                Yes. Find the Fox is a free chameleon game website: same idea as The Chameleon party game, with a fox in
                place of the chameleon. It runs in your browser on any phone, tablet or computer, so there is nothing to
                download or buy.
              </p>
            </div>

            <div className={styles.faqItem}>
              <h3>How do I play the chameleon game online with friends?</h3>
              <p>
                Enter a player name on <Link href="/">the home page</Link>, host a private room in the lobby, and send
                your friends the room link or code. Once 3 or more players have joined, the host starts the game. Pair
                it with a video or voice call for the full party-game experience.
              </p>
            </div>

            <div className={styles.faqItem}>
              <h3>Is Find the Fox the official Chameleon game?</h3>
              <p>
                No. Find the Fox is an independent, fan-made game inspired by The Chameleon. It is not affiliated with
                or endorsed by Big Potato Games.
              </p>
            </div>

            <div className={styles.faqItem}>
              <h3>How is Find the Fox different from The Chameleon?</h3>
              <p>
                The core game is the same: one hidden player (the fox instead of the chameleon) doesn&apos;t know the
                secret word and has to bluff a clue. A few things are different online:
              </p>
              <ul>
                <li>The word grid and secret word are picked for you, so there are no code cards or dice.</li>
                <li>Everyone types their clue at the same time instead of saying it aloud in turn.</li>
                <li>
                  The host can let the fox see one random player&apos;s clue before giving theirs, which makes bluffing
                  easier.
                </li>
                <li>Optional rules: 1 point for voting for the fox, anonymous voting and a 1-minute clue timer.</li>
              </ul>
            </div>

            <div className={styles.faqItem}>
              <h3>How do I join a game?</h3>
              <p>
                You can join a public game from <Link href="/lobby">the lobby</Link> or via url &quot;/lobby/
                <i>&lt;room code&gt;</i>&quot;. To join a private game, you need a room code from the host. With the
                room code you can enter via lobby or url. Enter your player name on the homepage, then go to the lobby
                and enter the room code. You can also create your own room to host a game.
              </p>
            </div>

            <div className={styles.faqItem}>
              <h3>How many players can play?</h3>
              <p>Find the Fox supports 3-12 players.</p>
            </div>

            <div className={styles.faqItem}>
              <h3>Do I need to create an account?</h3>
              <p>
                No account required! Simply enter a player name and start playing immediately. Your name is saved to
                your device so you don&apos;t need to re-enter it each time.
              </p>
            </div>
          </section>

          <section className={styles.section}>
            <h2>Gameplay</h2>

            <div className={styles.faqItem}>
              <h3>What happens if I&apos;m the fox and don&apos;t know the Keyword?</h3>
              <p>
                As the fox, you need to rely on your free clue and the board words to blend in. Pay close attention to
                the free clue and what other words on the board might relate to it.
              </p>
            </div>

            <div className={styles.faqItem}>
              <h3>Can the fox win even if they&apos;re caught?</h3>
              <p>
                Yes! If the fox is voted out, they get one chance to guess the keyword. If they guess correctly, the fox
                wins the round. This makes it so that obvious clues can backfire on detectives.
              </p>
            </div>

            <div className={styles.faqItem}>
              <h3>How long does a typical game last?</h3>
              <p>
                Each round typically lasts 1-3 minutes, depending on the number of players and discussion time. Most
                groups play multiple rounds, with the complete session lasting 30-60 minutes.
              </p>
            </div>

            <div className={styles.faqItem}>
              <h3>Can I play with voice chat?</h3>
              <p>
                While the game includes text chat, we highly recommend using external voice chat (Discord, Zoom, etc.)
                for the best experience. Voice communication adds nuance and makes the social deduction aspects more
                engaging.
              </p>
            </div>
          </section>

          <section className={styles.section}>
            <h2>Technical Support</h2>

            <div className={styles.faqItem}>
              <h3>The game isn&apos;t loading properly. What should I do?</h3>
              <p>
                Try refreshing your browser first. If issues persist, clear your browser cache and cookies. Make sure
                you&apos;re using a modern browser (Chrome, Firefox, etc). Feel free to report any issues{' '}
                <a href="https://find-the-fox.canny.io/feature-requests" target="_blank" rel="noopener noreferrer">
                  here
                </a>
                .
              </p>
            </div>

            <div className={styles.faqItem}>
              <h3>I&apos;m having connection issues. How can I fix this?</h3>
              <p>
                Check your internet connection and try refreshing the page. If you&apos;re still having trouble, try
                switching to a different network or using mobile data. The game requires a stable internet connection to
                synchronize with other players.
              </p>
            </div>

            <div className={styles.faqItem}>
              <h3>Does the game work on mobile devices?</h3>
              <p>
                Yes! Find the Fox is fully responsive and works great on phones and tablets. The interface adapts to
                your screen size for an optimal mobile experience.
              </p>
            </div>

            <div className={styles.faqItem}>
              <h3>Can I report bugs or suggest features?</h3>
              <p>
                Absolutely! We welcome feedback and bug reports. You can submit them through our{' '}
                <a href="https://find-the-fox.canny.io/feature-requests" target="_blank" rel="noopener noreferrer">
                  Canny board
                </a>{' '}
                or{' '}
                <a href="https://www.patreon.com/c/ThorsteinGames" target="_blank" rel="noopener noreferrer">
                  Patreon
                </a>
                . Your input helps make the game better for everyone.
              </p>
            </div>
          </section>

          <section className={styles.section}>
            <h2>Game Variants & Strategy</h2>

            <div className={styles.faqItem}>
              <h3>Are there different difficulty levels?</h3>
              <p>
                The game adapts naturally based on your group&apos;s experience. New players tend to give more obvious
                clues, while experienced groups develop subtle strategies and mind games that increase complexity. Go
                easy on new players!
              </p>
            </div>

            <div className={styles.faqItem}>
              <h3>What&apos;s the best strategy for winning?</h3>
              <p>
                As a detective: Give clues that prove you know the keyword without helping the fox too much. As the fox:
                Use your free clue and connect it to the other words on the board to blend in.
              </p>
            </div>

            <div className={styles.faqItem}>
              <h3>Can we create custom keywords?</h3>
              <p>
                Currently, the game uses a curated set of keywords designed for balanced gameplay. Custom keywords may
                be added in future updates based on user feedback and demand.
              </p>
            </div>
          </section>

          <section className={styles.section}>
            <h2>Still Have Questions?</h2>
            <p>
              If you can&apos;t find the answer you&apos;re looking for, feel free to reach out through our{' '}
              <a href="https://find-the-fox.canny.io/feature-requests" target="_blank" rel="noopener noreferrer">
                bug report system
              </a>{' '}
              or{' '}
              <a href="https://www.patreon.com/c/ThorsteinGames" target="_blank" rel="noopener noreferrer">
                Patreon
              </a>
              . We&apos;re always happy to help new players get started and experienced players troubleshoot issues.
            </p>
          </section>
        </div>
      </div>
    </PageLayout>
  );
};

export default FAQ;
