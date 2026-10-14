import PageLayout from '../modules/PageLayout';
import styles from '../styles/content-page.module.scss';

const HowToPlay = () => {
  return (
    <PageLayout
      title="How to Play the Chameleon Game Online"
      description="How to play chameleon online with Find the Fox: rules, scoring and tips for the chameleon game online with friends. Learn to blend in as the fox or catch them as a detective."
      url="/how-to-play"
    >
      <div className={styles.container}>
        <div className={styles.content}>
          <h1>How to Play Find the Fox</h1>
          <h2>The Chameleon Game Online, Explained</h2>

          <section className={styles.section}>
            <h2>Game Overview</h2>
            <p>
              Find the Fox is an exciting social deduction game where players work together to identify the hidden fox
              among them. One player is secretly the fox, while others are detectives trying to catch the fox without
              giving away too much information.
            </p>
            <p>
              If you know The Chameleon board game, you already know how to play: the fox is our chameleon. Find the Fox
              is how to play the chameleon game online with friends, with the board, roles, voting and scoring handled
              for you in the browser.
            </p>
          </section>

          <section className={styles.section}>
            <h2>Setup</h2>
            <ul>
              <li>3-12 players can join a game</li>
              <li>One player creates a room and shares the room code</li>
              <li>Other players join using the room code</li>
              <li>The host starts the game when everyone is ready</li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2>Game Rules</h2>

            <h3>Round Structure</h3>
            <ol>
              <li>
                <strong>Role Assignment:</strong> One player is randomly chosen as the fox
              </li>
              <li>
                <strong>Keyword Reveal:</strong> All players except the fox see the secret keyword
              </li>
              <li>
                <strong>Clue Phase:</strong> Players all submit <i>non-obvious</i> clues related to the keyword
                <br />
                The fox submits a fake clue to blend in
              </li>
              <li>
                <strong>Voting Phase:</strong> Everyone votes for who they think is the fox
              </li>
              <li>
                <strong>Reveal Phase:</strong> The player with the most votes is revealed
                <br />
                If it&apos;s the fox, detectives win; if not, the fox gets a chance to guess the keyword
              </li>
            </ol>

            <h3>For Detectives</h3>
            <ul>
              <li>Give clues that relate to the keyword without being too obvious</li>
              <li>Read all other players&apos; clues before guessing</li>
              <li>Watch for players who seem confused or give vague answers</li>
              <li>Vote for the player you suspect is the fox</li>
            </ul>

            <h3>For the Fox</h3>
            <ul>
              <li>Use your one free obfuscated clue to mislead detectives</li>
              <li>Give believable clues that fit with what the free clue and board keyword is</li>
              <li>If caught, you can still win by guessing the keyword correctly</li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2>Winning Conditions</h2>

            <h3>Detectives Win When:</h3>
            <ul>
              <li>They correctly identify and vote out the fox</li>
              <li>The fox fails to guess the keyword after being caught</li>
            </ul>

            <h3>Fox Wins When:</h3>
            <ul>
              <li>They avoid being voted out</li>
              <li>They correctly guess the keyword after being caught</li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2>Pro Tips</h2>
            <ul>
              <li>
                <strong>Be Creative:</strong> Give clues that are specific enough to prove you know the keyword, but not
                so obvious that the fox can easily guess
              </li>
              <li>
                <strong>Pay Attention:</strong> Watch for hesitation, overly vague answers, or clues that don&apos;t
                quite fit
              </li>
              <li>
                <strong>Stay Calm:</strong> Whether you&apos;re the fox or a detective, appearing nervous can make you
                suspicious
              </li>
              <li>
                <strong>Use Voice Chat:</strong> If available, voice communication adds an extra layer of social
                deduction
              </li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2>Ready to Play?</h2>
            <p>
              Now that you know the rules, jump into a game and test your deduction skills! Remember, the key to success
              is finding the perfect balance between being helpful to your team and not giving too much away to the fox.
            </p>
          </section>
        </div>
      </div>
    </PageLayout>
  );
};

export default HowToPlay;
