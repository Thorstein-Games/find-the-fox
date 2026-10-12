import { useEffect, useMemo, useRef, useState } from 'react';

import type { ChatEntry } from '../../lib/fox/types';
import Launcher from './Launcher';
import { toBubbles } from './types';

interface ChatProps {
  headerName: string;
  playerName: string;
  /** null until the history has loaded */
  messages: ChatEntry[] | null;
  onSend: (message: string, type?: 'emoji') => void;
}

const Chat = ({ messages, onSend, playerName, headerName }: ChatProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [newMessagesCount, setNewMessagesCount] = useState(0);
  const previous = useRef(messages);

  // Count updates that arrive while the window is closed. `null` means the
  // history hasn't loaded yet; its arrival on join isn't new activity.
  useEffect(() => {
    const before = previous.current;
    previous.current = messages;
    if (before === null || messages === before || !messages) return;
    // A live message is appended after the previous last entry; a resent history (reconnect) isn't.
    const appended =
      messages.length > 0 &&
      (before.length === 0 ? messages.length === 1 : messages[messages.length - 2] === before[before.length - 1]);
    if (appended && !isOpen) setNewMessagesCount((count) => count + 1);
  }, [messages]);

  const bubbles = useMemo(() => toBubbles(messages ?? []), [messages]);

  const handleOpen = () => {
    setIsOpen((open) => !open);
    setNewMessagesCount(0);
  };

  return (
    <Launcher
      showEmoji
      onMessageWasSent={({ type, message }) => onSend(message, type)}
      messageList={bubbles}
      newMessagesCount={newMessagesCount}
      handleClick={handleOpen}
      isOpen={isOpen}
      username={playerName}
      headerName={headerName}
    />
  );
};

export default Chat;
