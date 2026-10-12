import { useEffect, useRef } from 'react';

import type { ChatBubble } from './types';
import Message from './Message';

const MessageList = ({ messageList, username }: { messageList: ChatBubble[]; username: string }) => {
  const scrollList = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollList.current) {
      scrollList.current.scrollTop = scrollList.current.scrollHeight;
    }
  }, [messageList]);

  return (
    <div className="sc-message-list" ref={scrollList}>
      {messageList.map((chat, i) => (
        <Message chat={chat} username={username} key={`${chat.timestamp}-${i}`} />
      ))}
    </div>
  );
};

export default MessageList;
