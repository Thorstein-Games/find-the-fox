import { useEffect, useRef, useState } from 'react';

import type { ChatMessage } from '../../lib/fox/types';
import ChatWindow from './ChatWindow';
import type { OutgoingMessage } from './types';

interface LauncherProps {
  onMessageWasSent: (message: OutgoingMessage) => void;
  newMessagesCount?: number;
  isOpen: boolean;
  handleClick?: () => void;
  messageList: ChatMessage[];
  mute?: boolean;
  showEmoji?: boolean;
  username: string;
  headerName: string;
}

const Launcher = ({
  onMessageWasSent,
  newMessagesCount = 0,
  isOpen,
  handleClick,
  messageList,
  mute,
  showEmoji = true,
  username,
  headerName,
}: LauncherProps) => {
  const [open, setOpen] = useState(false);
  const firstUpdate = useRef(true);
  const audio = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    setOpen(isOpen);
  }, [isOpen]);

  useEffect(() => {
    if (firstUpdate.current) {
      firstUpdate.current = false;
      return;
    }

    if (mute) {
      return;
    }
    const nextMessage: Partial<ChatMessage> = messageList[messageList.length - 1] || {};
    const isIncoming = nextMessage.username !== username && nextMessage.prevUser !== username;
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

    if (isIncoming && audio.current && !isSafari) {
      audio.current.play().catch(() => {});
    }
  }, [messageList, mute, username]);

  const onClick = () => {
    if (handleClick) {
      handleClick();
    } else {
      setOpen((prev) => !prev);
    }
  };

  const classList = ['sc-launcher', open ? 'opened' : ''];
  return (
    <div id="sc-launcher">
      <div className={classList.join(' ')} onClick={onClick} onKeyDown={onClick}>
        <MessageCount count={newMessagesCount} open={open} />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="sc-open-icon" src="/chat/close-icon.png" alt="close icon" />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="sc-closed-icon" src="/chat/logo-no-bg.svg" alt="chat bubble" />
        <audio ref={audio}>
          <source src="/chat/notification.mp3" type="audio/mpeg" />
          Your browser does not support the audio element.
        </audio>
      </div>
      <ChatWindow
        messageList={messageList}
        onMessageWasSent={onMessageWasSent}
        isOpen={open}
        onClose={onClick}
        showEmoji={showEmoji}
        headerName={headerName}
        username={username}
      />
    </div>
  );
};

const MessageCount = ({ count, open }: { count: number; open: boolean }) => {
  if (count === 0 || open === true) {
    return null;
  }
  return <div className="sc-new-messages-count">{count}</div>;
};

export default Launcher;
