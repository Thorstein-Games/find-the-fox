import { Children, Fragment } from 'react';
import type { ReactNode } from 'react';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';

import cx from 'classnames';

import { useFox } from '../../lib/fox/FoxProvider';
import styles from './header.module.scss';

interface HeaderProps {
  children?: ReactNode;
  showPlayersOnline?: boolean;
  showConnection?: boolean;
  /** Overrides the lobby connection state (the game page shows its room connection). */
  connected?: boolean;
}

const Header = ({ children, showPlayersOnline = false, showConnection = false, connected }: HeaderProps) => {
  const fox = useFox();
  const { playersOnline } = fox;
  const isConnected = connected ?? fox.connected;

  return (
    <header className={styles.header}>
      <div className={styles['header-col']}>
        <div className={styles['header-connection']}>
          {children &&
            Children.map(children, (child, i) => (
              <Fragment key={i}>
                {child}
                <span className={styles['header-separator']} />
              </Fragment>
            ))}
          {showConnection && (
            <>
              <span className={styles['connection-label']}>Connection: </span>
              <span className={cx(styles.circle, isConnected ? styles.connected : styles.notConnected)} />
            </>
          )}
          {showPlayersOnline && (
            <>
              <span className={styles['header-separator']} />
              <OverlayTrigger
                placement="bottom"
                overlay={<Tooltip id="tooltip-player-names">{playersOnline.join(', ')}</Tooltip>}
              >
                <span className={styles['connection-label']}>Players online: {playersOnline.length}</span>
              </OverlayTrigger>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
