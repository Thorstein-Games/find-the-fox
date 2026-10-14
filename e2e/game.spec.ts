import { expect, test } from '@playwright/test';

import { hostGame, joinFromLobby, login, nameFor } from './helpers';

test('a full round: clues, catching the fox, and its guess', async ({ browser }) => {
  const [ann, ben, cat] = ['Ann', 'Ben', 'Cat'].map(nameFor);
  const a = await login(browser, ann);
  await a.waitForURL('**/lobby');
  await hostGame(a);
  const b = await login(browser, ben);
  await joinFromLobby(b, ann);
  const c = await login(browser, cat);
  await joinFromLobby(c, ann);

  const players = { [ann]: a, [ben]: b, [cat]: c };
  await a.getByRole('button', { name: 'Start Game' }).click();

  // Exactly one fox; everyone else sees the same keyword.
  await expect(a.getByRole('heading', { name: /Keyword|FOX/ })).toBeVisible();
  let foxName = '';
  const keywords = new Set<string>();
  for (const [name, page] of Object.entries(players)) {
    const subtitle = await page.getByRole('heading', { name: /Keyword|FOX/ }).innerText();
    if (subtitle.includes('FOX')) foxName = name;
    else keywords.add(subtitle);
  }
  expect(foxName).not.toBe('');
  expect(keywords.size).toBe(1);

  for (const [name, page] of Object.entries(players)) {
    await page.locator('input[name=clue]').fill(`clue from ${name}`);
    await page.getByRole('button', { name: 'Submit' }).click();
  }
  await expect(a.getByText("Who's the fox? Vote.")).toBeVisible();
  await expect(a.getByText(`clue from ${foxName}`)).toBeVisible();

  const names = Object.keys(players);
  for (const [name, page] of Object.entries(players)) {
    const target = name === foxName ? names.find((n) => n !== foxName)! : foxName;
    await page.locator('button.btn', { hasText: target }).click();
  }

  const fox = players[foxName];
  await expect(fox.getByText('Guess/Select a word below')).toBeVisible();
  const keyword = [...keywords][0].replace('Keyword: ', '');
  await fox.locator('#clue-table td', { hasText: new RegExp(`^${keyword}$`) }).click();

  await expect(a.getByText('The fox guessed the CORRECT word', { exact: false })).toBeVisible();
  // Match on the Player column: other rows mention the fox in their Vote column.
  const foxRow = a.locator('tbody tr').filter({ has: a.locator('td:first-child', { hasText: new RegExp(`^${foxName}$`) }) });
  await expect(foxRow.locator('td').nth(1)).toHaveText('1');
  await expect(a.getByRole('button', { name: 'Next Round' })).toBeVisible();

  // Scores feed the site-wide leaderboard (megingjord's shared leaderboard service).
  await fox.getByRole('button', { name: /Leave Room/ }).click();
  await fox.waitForURL('**/lobby');
  const daily = fox.locator('.card', { hasText: 'Daily Leader' });
  await expect(daily.getByText(/[1-9]\d* points/)).toBeVisible();
});

test('shared links, private rooms and kicking', async ({ browser }) => {
  const [host, guest, friend] = ['Hal', 'Gus', 'Fay'].map(nameFor);
  const h = await login(browser, host);
  await h.waitForURL('**/lobby');
  const code = await hostGame(h, { privateRoom: true });

  // A brand-new visitor following the link picks a name, then lands in the room.
  const g = await (await browser.newContext()).newPage();
  await g.goto(`/room/${code}`);
  await g.waitForURL(/\?next=/);
  await g.getByLabel('Player Name').fill(guest);
  await g.getByRole('button', { name: 'Enter Lobby' }).click();
  await g.waitForURL(`**/room/${code}`);
  await expect(g.locator('tbody tr', { hasText: host })).toBeVisible();

  // Private room from the lobby needs the code.
  const f = await login(browser, friend);
  await f.waitForURL('**/lobby');
  const card = f.locator('.card', { hasText: `Host: ${host}` });
  await card.getByPlaceholder('Type in game id').fill('NOPE');
  await card.getByRole('button', { name: 'Join Game' }).click();
  await expect(card.getByText('Incorrect game id')).toBeVisible();
  await card.getByPlaceholder('Type in game id').fill(code.toLowerCase());
  await card.getByRole('button', { name: 'Join Game' }).click();
  await f.waitForURL(`**/room/${code}`);

  // Host kicks the friend, who is sent back to the lobby with a notice.
  await h.locator('[role=button]', { hasText: friend }).click();
  await f.waitForURL('**/lobby');
  await expect(f.getByText('Kicked from Room')).toBeVisible();
  await expect(h.locator('tbody tr', { hasText: friend })).toHaveCount(0);
});

test('names are unique across the site', async ({ browser }) => {
  const name = nameFor('Uma');
  const first = await login(browser, name);
  await first.waitForURL('**/lobby');
  const second = await login(browser, name.toLowerCase());
  await expect(second.getByText('The name you selected is already taken')).toBeVisible();
});
