import emojiData from './emojiData.json';

interface EmojiCategory {
  name: string;
  emojis: { char: string; name: string }[];
}

const EmojiPicker = ({ onEmojiPicked, filter }: { onEmojiPicked: (emoji: string) => void; filter: string }) => (
  <div className="sc-emoji-picker">
    {(emojiData as EmojiCategory[]).map((category) => {
      const filteredEmojis = category.emojis.filter(({ name }) => name.includes(filter));
      return (
        <div className="sc-emoji-picker--category" key={category.name}>
          {filteredEmojis.length > 0 && <div className="sc-emoji-picker--category-title">{category.name}</div>}
          {filteredEmojis.map(({ char }) => {
            return (
              <span
                key={char}
                className="sc-emoji-picker--emoji"
                onClick={() => onEmojiPicked(char)}
                onKeyDown={() => onEmojiPicked(char)}
              >
                {char}
              </span>
            );
          })}
        </div>
      );
    })}
  </div>
);

export default EmojiPicker;
