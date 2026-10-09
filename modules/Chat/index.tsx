import { useEffect, useRef, useState } from 'react';

import type { ChatMessage } from '../../lib/fox/types';
import Launcher from './Launcher';

interface ChatProps {
  headerName: string;
  playerName: string;
  /** null until the history has loaded */
  messages: ChatMessage[] | null;
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
    const latest = messages[messages.length - 1]?.timestamp ?? 0;
    const prevLatest = before[before.length - 1]?.timestamp ?? 0;
    if (latest > prevLatest && !isOpen) setNewMessagesCount((count) => count + 1);
  }, [messages]);

  const handleOpen = () => {
    setIsOpen((open) => !open);
    setNewMessagesCount(0);
  };

  return (
    <Launcher
      showEmoji
      onMessageWasSent={({ type, message }) => onSend(message, type)}
      messageList={messages ?? []}
      newMessagesCount={newMessagesCount}
      handleClick={handleOpen}
      isOpen={isOpen}
      username={playerName}
      headerName={headerName}
    />
  );
};

export default Chat;
