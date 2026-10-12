import Badge from 'react-bootstrap/Badge';
import Card from 'react-bootstrap/Card';

import { useFox } from '../../lib/fox/FoxProvider';
import styles from './lobby.module.scss';

const Leaderboard = () => {
  const { leaderboard } = useFox();

  if (!leaderboard) {
    return null;
  }

  // The board keeps one leader per period; an empty period shows "0 points", as before.
  const daily = leaderboard.daily?.entries[0];
  const weekly = leaderboard.weekly?.entries[0];

  return (
    <div className={styles['leaderboard-wrapper']}>
      <h3>🏆 Leaderboard</h3>
      <div className={styles['leaderboard-cards']}>
        <Card className={styles['leaderboard-card']}>
          <Card.Body>
            <Card.Title>
              <Badge>Daily Leader</Badge>
            </Card.Title>
            <Card.Text className={styles['leader-info']}>
              <span className={styles['leader-name']}>{daily?.name ?? ''}</span>
              <span className={styles['leader-points']}>{daily?.points ?? 0} points</span>
            </Card.Text>
          </Card.Body>
        </Card>
        <Card className={styles['leaderboard-card']}>
          <Card.Body>
            <Card.Title>
              <Badge>Weekly Leader</Badge>
            </Card.Title>
            <Card.Text className={styles['leader-info']}>
              <span className={styles['leader-name']}>{weekly?.name ?? ''}</span>
              <span className={styles['leader-points']}>{weekly?.points ?? 0} points</span>
            </Card.Text>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
};

export default Leaderboard;
