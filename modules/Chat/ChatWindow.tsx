import { useEffect } from 'react';

import useIsMobile from '../../hooks/useIsMobile';
import type { ChatMessage } from '../../lib/fox/types';
import Header from './Header';
import MessageList from './MessageList';
import UserInput from './UserInput';
import type { OutgoingMessage } from './types';

interface ChatWindowProps {
  messageList: ChatMessage[];
  onMessageWasSent: (message: OutgoingMessage) => void;
  headerName: string;
  isOpen: boolean;
  onClose: () => void;
  showEmoji: boolean;
  username: string;
}

const ChatWindow = ({ messageList, onMessageWasSent, headerName, isOpen, onClose, showEmoji, username }: ChatWindowProps) => {
  const isMobile = useIsMobile();
  const onSubmit = (message: OutgoingMessage) => {
    onMessageWasSent(message);
  };

  useEffect(() => {
    if (!isMobile) return;
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

    function resetBody() {
      if (document.body) {
        document.body.style.overflow = '';
        if (isSafari) {
          const offsetY = Math.abs(parseInt(document.body.style.top || '0', 10));
          document.body.style.position = '';
          document.body.style.top = '';
          window.scrollTo(0, offsetY || 0);
        }
      }
    }
    if (isOpen) {
      const scroll = window.scrollY;
      document.body.style.overflow = 'hidden';
      if (isSafari) {
        document.body.style.position = 'fixed';
        document.body.style.top = `${scroll}px`;
      }
    } else {
      resetBody();
    }
  }, [isOpen, isMobile]);

  const classList = ['sc-chat-window', isOpen ? 'opened' : 'closed'];
  return (
    <div className={classList.join(' ')}>
      <Header headerName={headerName} onClose={onClose} />
      <MessageList messageList={messageList} username={username} />
      <UserInput onSubmit={onSubmit} showEmoji={showEmoji} />
    </div>
  );
};

export default ChatWindow;
