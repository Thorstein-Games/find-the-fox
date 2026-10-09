import type { Toast } from './types';

/**
 * App-wide toast channel. Server "toaster" messages (from the lobby or the
 * game room) and client-side notices all go through here, so the <Toasts>
 * component works the same as the original socket-driven one.
 *
 * Toasts emitted while no <Toasts> is mounted (e.g. "Kicked from Room" right
 * as the page switches to the lobby) are held briefly for the next one.
 */
type Listener = (toast: Toast) => void;
const listeners = new Set<Listener>();
const HOLD_MS = 4000;
let held: { toast: Toast; at: number }[] = [];

export function emitToast(toast: Toast): void {
  if (listeners.size === 0) {
    held.push({ toast, at: Date.now() });
    return;
  }
  listeners.forEach((listener) => listener(toast));
}

export function onToast(listener: Listener): () => void {
  listeners.add(listener);
  const now = Date.now();
  const pending = held.filter((entry) => now - entry.at < HOLD_MS);
  held = [];
  pending.forEach(({ toast }) => listener(toast));
  return () => {
    listeners.delete(listener);
  };
}
