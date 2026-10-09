import PageLayout from '../modules/PageLayout';
import styles from '../styles/content-page.module.scss';

const WhyToPlay = () => {
  return (
    <PageLayout
      title="Why Play Find the Fox"
      description="Discover why Find the Fox is the perfect online party game for friends, families, and team building. Free, fun, and engaging social deduction gameplay!"
      url="/why-to-play"
    >
      <div className={styles.container}>
        <div className={styles.content}>
          <h1>Why Play Find the Fox?</h1>

          <section className={styles.section}>
            <h2>Perfect for Any Group</h2>
            <p>
              Find the Fox brings people together like no other game. Whether you&apos;re looking to break the ice with
              new friends, strengthen bonds with family, or add excitement to your team meetings, this game delivers
              unforgettable moments of laughter, suspicion, and triumph.
            </p>
          </section>

          <section className={styles.section}>
            <h2>🎮 Easy to Learn, Impossible to Master</h2>
            <p>
              You can explain the rules in under 2 minutes, but the psychological depth and strategic nuance will keep
              you coming back for more. Every round presents new challenges as players adapt their strategies and
              develop clever ways to deceive or detect.
            </p>
          </section>

          <section className={styles.section}>
            <h2>💰 Completely Free Forever</h2>
            <p>
              No hidden costs, no premium features locked behind paywalls, no advertisements interrupting your gameplay.
              We believe great games should be accessible to everyone, regardless of budget.
            </p>
          </section>

          <section className={styles.section}>
            <h2>🌟 Key Benefits</h2>

            <div className={styles.benefitsList}>
              <div className={styles.benefit}>
                <h3>🧠 Develops Critical Thinking</h3>
                <p>
                  Sharpen your deduction skills, learn to read between the lines, and practice logical reasoning in a
                  fun, low-pressure environment.
                </p>
              </div>

              <div className={styles.benefit}>
                <h3>💬 Improves Communication</h3>
                <p>
                  Learn to give precise clues, ask strategic questions, and pick up on subtle verbal and non-verbal cues
                  from other players.
                </p>
              </div>

              <div className={styles.benefit}>
                <h3>🎭 Builds Confidence</h3>
                <p>
                  Practice thinking on your feet, performing under pressure, and convincing others of your perspective –
                  valuable skills in any social situation.
                </p>
              </div>

              <div className={styles.benefit}>
                <h3>🤝 Strengthens Relationships</h3>
                <p>
                  Shared moments of triumph, betrayal, and hilarious misunderstandings create lasting memories and
                  inside jokes with friends and family.
                </p>
              </div>
            </div>
          </section>

          <section className={styles.section}>
            <h2>🌍 Play Anywhere, Anytime</h2>
            <ul>
              <li>
                <strong>Cross-Platform:</strong> Works on any device with a web browser
              </li>
              <li>
                <strong>No Downloads:</strong> Play instantly without installing anything
              </li>
              <li>
                <strong>Remote-Friendly:</strong> Perfect for virtual hangouts and online events
              </li>
              <li>
                <strong>Quick Sessions:</strong> Rounds last 1-3 minutes, perfect for any schedule
              </li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2>🎯 Perfect for Different Occasions</h2>

            <div className={styles.occasionsList}>
              <div className={styles.occasion}>
                <h3>🎉 Party Games</h3>
                <p>Break the ice at parties and get everyone laughing together</p>
              </div>

              <div className={styles.occasion}>
                <h3>👨‍👩‍👧‍👦 Family Time</h3>
                <p>Bridge generational gaps with gameplay that&apos;s fun for all ages</p>
              </div>

              <div className={styles.occasion}>
                <h3>💼 Team Building</h3>
                <p>Build trust and communication skills in corporate settings</p>
              </div>

              <div className={styles.occasion}>
                <h3>🎓 Educational</h3>
                <p>Teach logic, communication, and social skills in classrooms</p>
              </div>

              <div className={styles.occasion}>
                <h3>📱 Virtual Hangouts</h3>
                <p>Stay connected with friends and family across distances</p>
              </div>

              <div className={styles.occasion}>
                <h3>🏠 Casual Gaming</h3>
                <p>Unwind with friends after work or on weekends</p>
              </div>
            </div>
          </section>

          <section className={styles.section}>
            <h2>🎪 The Social Experience</h2>
            <p>
              In our digital age, meaningful face-to-face (or screen-to-screen) interaction is more valuable than ever.
              Find the Fox creates moments of genuine human connection &ndash; the nervous laughter when you&apos;re
              suspected, the satisfaction of a perfect deduction, the group celebration when the fox is caught.
            </p>

            <p>
              These shared experiences transcend the game itself, creating bonds and memories that last long after the
              final vote is cast.
            </p>
          </section>

          <section className={styles.section}>
            <h2>🚀 Ready to Start Playing?</h2>
            <p>
              Join thousands of players who have discovered the joy of Find the Fox. Whether you&apos;re a seasoned
              gamer or complete newcomer, whether you&apos;re playing with longtime friends or meeting new people,
              you&apos;re just one click away from your next great gaming experience.
            </p>

            <p>
              <strong>No registration required. No downloads needed. Just pure, instant fun.</strong>
            </p>
          </section>
        </div>
      </div>
    </PageLayout>
  );
};

export default WhyToPlay;
