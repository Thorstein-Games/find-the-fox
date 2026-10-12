import { memo } from 'react';

import type { ChatBubble } from '../types';
import TextMessage from './TextMessage';

const Message = ({ chat, username }: { chat: ChatBubble; username: string }) => {
  const renderMessageOfType = (type?: string) => {
    switch (type) {
      case 'emoji':
        return <div className="sc-message--emoji">{chat.message}</div>;
      default:
        return <TextMessage message={chat.message} />;
    }
  };

  const isUser = chat.username === username || chat.prevUser === username;
  const messageClass = ['sc-message', chat.prevUser ? 'prev-user' : ''];
  const contentClassList = ['sc-message--content', isUser ? 'sent' : 'received'];
  return (
    <div className={messageClass.join(' ')}>
      {!isUser && !chat.prevUser && <div className="sc-message--username">{chat.username}</div>}
      <div className={contentClassList.join(' ')}>{renderMessageOfType(chat.type)}</div>
    </div>
  );
};

export default memo(Message);
