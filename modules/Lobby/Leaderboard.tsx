import Badge from 'react-bootstrap/Badge';
import Card from 'react-bootstrap/Card';

import { useFox } from '../../lib/fox/FoxProvider';
import styles from './lobby.module.scss';

const Leaderboard = () => {
  const { leaderboard } = useFox();

  if (!leaderboard) {
    return null;
  }

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
              <span className={styles['leader-name']}>{leaderboard.daily.name}</span>
              <span className={styles['leader-points']}>{leaderboard.daily.points} points</span>
            </Card.Text>
          </Card.Body>
        </Card>
        <Card className={styles['leaderboard-card']}>
          <Card.Body>
            <Card.Title>
              <Badge>Weekly Leader</Badge>
            </Card.Title>
            <Card.Text className={styles['leader-info']}>
              <span className={styles['leader-name']}>{leaderboard.weekly.name}</span>
              <span className={styles['leader-points']}>{leaderboard.weekly.points} points</span>
            </Card.Text>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
};

export default Leaderboard;
