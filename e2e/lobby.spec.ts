import { expect, test } from '@playwright/test';

import { hostGame, joinFromLobby, login, nameFor, openChat, sendChat } from './helpers';

// Megingjord's shared chat service: live delivery plus history for whoever
// arrives (or reloads) later, in both the site-wide lobby and game rooms.

test('lobby chat and players online', async ({ browser }) => {
  const [ada, bo] = ['Ada', 'Bo'].map(nameFor);
  const a = await login(browser, ada);
  await a.waitForURL('**/lobby');
  const b = await login(browser, bo);
  await b.waitForURL('**/lobby');

  await b.getByText(/Players online: \d+/).hover();
  await expect(b.locator('#tooltip-player-names')).toContainText(ada);

  const text = `lobby hello ${Date.now()}`;
  await sendChat(a, text);
  await openChat(b);
  await expect(b.locator('.sc-message-list').getByText(text)).toBeVisible();

  // History is replayed after a reload.
  await b.reload();
  await openChat(b);
  await expect(b.locator('.sc-message-list').getByText(text)).toBeVisible();
});

test('room chat is replayed to players who join later', async ({ browser }) => {
  const [cy, di] = ['Cy', 'Di'].map(nameFor);
  const c = await login(browser, cy);
  await c.waitForURL('**/lobby');
  await hostGame(c);
  const early = `before you came ${Date.now()}`;
  await sendChat(c, early);

  const d = await login(browser, di);
  await joinFromLobby(d, cy);
  await openChat(d);
  await expect(d.locator('.sc-message-list').getByText(early)).toBeVisible();

  const reply = `hi ${cy}`;
  await sendChat(d, reply);
  await openChat(c);
  await expect(c.locator('.sc-message-list').getByText(reply)).toBeVisible();
});
