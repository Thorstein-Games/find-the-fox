import { useRef, useState } from 'react';
import type { KeyboardEvent, SyntheticEvent } from 'react';

import PopupWindow from './PopupWindow';
import EmojiPicker from './emoji-picker/EmojiPicker';
import EmojiIcon from './icons/EmojiIcon';
import SendIcon from './icons/SendIcon';
import type { OutgoingMessage } from './types';

interface UserInputProps {
  onSubmit: (message: OutgoingMessage) => void;
  showEmoji: boolean;
}

const UserInput = ({ onSubmit, showEmoji }: UserInputProps) => {
  const [inputActive, setInputActive] = useState(false);
  const [emojiPickerIsOpen, setEmojiPickerIsOpen] = useState(false);
  const [emojiFilter, setEmojiFilter] = useState('');
  const userInput = useRef<HTMLInputElement>(null);

  const submitText = (event: SyntheticEvent) => {
    event.preventDefault();
    const text = userInput.current?.value;
    if (text && text.length > 0 && userInput.current) {
      onSubmit({ message: text });
      userInput.current.value = '';
    }
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      submitText(event);
    }
  };

  const toggleEmojiPicker = (e: SyntheticEvent) => {
    e.preventDefault();
    if (!emojiPickerIsOpen) {
      setEmojiPickerIsOpen(true);
    }
  };

  const closeEmojiPicker = (e: MouseEvent) => {
    const emojiPickerButton = document.getElementById('sc-emoji-picker-button');
    if (emojiPickerButton?.contains(e.target as Node)) {
      e.stopPropagation();
      e.preventDefault();
    }
    setEmojiPickerIsOpen(false);
  };

  const handleEmojiPicked = (emoji: string) => {
    setEmojiPickerIsOpen(false);
    const input = userInput.current;
    if (input?.value) {
      input.value += emoji;
    } else {
      onSubmit({ type: 'emoji', message: emoji });
    }
  };

  return (
    <form className={`sc-user-input ${inputActive ? 'active' : ''}`}>
      <input
        onFocus={() => setInputActive(true)}
        onBlur={() => setInputActive(false)}
        ref={userInput}
        onKeyDown={handleKeyDown}
        aria-multiline="true"
        aria-label="message-body"
        placeholder="Write a reply..."
        className="sc-user-input--text"
      />
      <div className="sc-user-input--buttons">
        <div className="sc-user-input--button" />
        <div className="sc-user-input--button">
          {showEmoji && (
            <EmojiIcon
              onClick={toggleEmojiPicker}
              isActive={emojiPickerIsOpen}
              tooltip={
                <PopupWindow
                  isOpen={emojiPickerIsOpen}
                  onClickedOutside={closeEmojiPicker}
                  onInputChange={(event) => setEmojiFilter(event.target.value)}
                >
                  <EmojiPicker onEmojiPicked={handleEmojiPicked} filter={emojiFilter} />
                </PopupWindow>
              }
            />
          )}
        </div>
        <div className="sc-user-input--button">
          <SendIcon onClick={submitText} />
        </div>
      </div>
    </form>
  );
};

export default UserInput;
