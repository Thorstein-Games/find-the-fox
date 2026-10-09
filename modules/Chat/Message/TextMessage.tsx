import { Fragment } from 'react';

// Linkify plain-text chat: http(s) and www. URLs become links opening in a new tab.
// (Replaces the unmaintained react-linkify 1.0.0-alpha.)
const URL_PATTERN = /((?:https?:\/\/|www\.)[^\s<]+[^\s<.,:;"')\]!?])/gi;

const TextMessage = ({ message }: { message: string }) => {
  const parts = message.split(URL_PATTERN);
  return (
    <div className="sc-message--text">
      {parts.map((part, i) =>
        i % 2 === 1 ? (
          <a key={i} href={part.startsWith('www.') ? `https://${part}` : part} target="_blank" rel="noreferrer noopener">
            {part}
          </a>
        ) : (
          <Fragment key={i}>{part}</Fragment>
        ),
      )}
    </div>
  );
};

export default TextMessage;
