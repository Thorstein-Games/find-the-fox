import { expect, test } from '@playwright/test';

import { nameFor, playerRows, reload, roleHeading, seatPlayers, startRound, submitClue } from './helpers';

// Megingjord's BaseGameRoom treats a rejoin by name as a reconnect. These
// guard that every piece of a player's round survives a dropped connection.

test('reloading mid-round keeps your seat, role and clue', async ({ browser }) => {
  const names = ['Rae', 'Rob', 'Roy'].map(nameFor);
  const pages = await seatPlayers(browser, names);
  const host = pages[names[0]];
  const { foxName, keyword } = await startRound(pages, host);
  const fox = pages[foxName];
  const [hound] = names.filter((n) => n !== foxName);
  const houndPage = pages[hound];

  // A submitted clue is only in the player's private view until every clue is in.
  await submitClue(houndPage, `clue from ${hound}`);
  await reload(houndPage);
  expect(await roleHeading(houndPage)).toBe(`Keyword: ${keyword}`);
  await expect(houndPage.locator('input[name=clue]')).toBeDisabled();
  await expect(houndPage.locator('input[name=clue]')).toHaveValue(`clue from ${hound}`);
  await expect(houndPage.getByRole('button', { name: 'Edit Clue' })).toBeVisible();

  // The fox stays the fox, and never learns the keyword.
  await reload(fox);
  expect(await roleHeading(fox)).toContain('FOX');
  await expect(fox.getByText(`Keyword: ${keyword}`)).toHaveCount(0);

  // Nobody was dropped or duplicated, and the round carries on.
  for (const page of Object.values(pages)) await expect(playerRows(page)).toHaveCount(3);
  for (const name of names.filter((n) => n !== hound)) await submitClue(pages[name], `clue from ${name}`);
  await expect(host.getByText("Who's the fox? Vote.")).toBeVisible();
  await expect(host.getByText(`clue from ${hound}`)).toBeVisible();
});

test('when the host leaves, another player takes over', async ({ browser }) => {
  const names = ['Hop', 'Ivy', 'Jon'].map(nameFor);
  const pages = await seatPlayers(browser, names);
  const [hostName, ...rest] = names;

  await pages[hostName].getByRole('button', { name: /Leave Room/ }).click();
  await pages[hostName].waitForURL('**/lobby/**');

  for (const name of rest) await expect(playerRows(pages[name])).toHaveCount(2);
  await expect(pages[rest[0]].getByText('A new host has been assigned', { exact: false })).toBeVisible();
  const hosts = await Promise.all(
    rest.map((name) => pages[name].getByRole('button', { name: 'Start Game' }).isVisible()),
  );
  expect(hosts.filter(Boolean)).toHaveLength(1);
});
