import { QRCodeSVG } from 'qrcode.react';
import Button from 'react-bootstrap/Button';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Popover from 'react-bootstrap/Popover';

import useCopyClipboard from '../../hooks/useCopyClipboard';
import styles from './GameId.module.scss';

const GameId = ({ roomId }: { roomId: string }) => {
  const [isCopied, setIsCopied] = useCopyClipboard();

  const copyRoomUrl = () => {
    const roomUrl = `${window.location.origin}/room/${roomId}`;
    setIsCopied(roomUrl);
  };

  const roomUrl = typeof window !== 'undefined' ? `${window.location.origin}/room/${roomId}` : '';

  const qrCodePopover = (
    <Popover id="qr-code-popover" className={styles.qrPopover}>
      <Popover.Content className={styles.qrContent}>
        <div className={styles.qrCodeWrapper}>
          <QRCodeSVG value={roomUrl} size={200} level="H" includeMargin />
          {isCopied && <strong>Copied!</strong>}
          <p className={styles.qrText}>Scan to join room</p>
        </div>
      </Popover.Content>
    </Popover>
  );

  return (
    <div className={styles.container}>
      <OverlayTrigger trigger={['hover', 'click']} placement="bottom" overlay={qrCodePopover} rootClose>
        <span className={styles.gameIdText} role="button" tabIndex={0}>
          Game id:
          <Button
            variant={isCopied ? 'success' : 'info'}
            size="sm"
            onClick={copyRoomUrl}
            className={styles.copyButton}
            title="Copy room URL to share with friends"
          >
            {roomId} {isCopied ? '✅' : '📋'}
          </Button>
        </span>
      </OverlayTrigger>
    </div>
  );
};

export default GameId;
