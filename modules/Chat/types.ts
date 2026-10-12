import type { ChatEntry } from '../../lib/fox/types';

export interface OutgoingMessage {
  message: string;
  type?: 'emoji';
}

/**
 * A rendered chat bubble. The first of a run of messages from one player
 * shows their name (`username`); follow-ups carry `prevUser` and are grouped
 * under it. (The original server sent this shape; it's derived here now.)
 */
export interface ChatBubble {
  message: string;
  timestamp: number;
  username?: string;
  prevUser?: string;
  type?: 'emoji';
}

export function toBubbles(entries: ChatEntry[]): ChatBubble[] {
  return entries.map((entry, i) => {
    const bubble: ChatBubble = { message: entry.message, timestamp: entry.timestamp, type: entry.type };
    if (i > 0 && entries[i - 1].playerName === entry.playerName) {
      bubble.prevUser = entry.playerName;
    } else {
      bubble.username = entry.playerName;
    }
    return bubble;
  });
}
