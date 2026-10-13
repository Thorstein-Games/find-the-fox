import { expect, type Browser, type Page } from '@playwright/test';

// Names are unique site-wide, so suffix them per run.
export const run = Date.now().toString(36).slice(-4);
export const nameFor = (base: string) => `${base}${run}`;

export async function login(browser: Browser, name: string, path = '/'): Promise<Page> {
  const page = await (await browser.newContext()).newPage();
  await page.goto(path);
  await page.getByLabel('Player Name').fill(name);
  await page.getByRole('button', { name: 'Enter Lobby' }).click();
  return page;
}

export async function hostGame(page: Page, { privateRoom = false } = {}): Promise<string> {
  await page.getByRole('button', { name: 'Host Game' }).first().click();
  if (privateRoom) await page.locator('#privateRoom').check();
  await page.locator('.modal').getByRole('button', { name: 'Host Game' }).click();
  await page.waitForURL('**/room/**');
  const button = page.getByTitle('Copy room URL to share with friends');
  await expect(button).toBeVisible();
  return (await button.innerText()).replace(/[^A-Z0-9]/g, '');
}

export async function joinFromLobby(page: Page, host: string) {
  await page.locator('.card', { hasText: `Host: ${host}` }).getByRole('button', { name: 'Join Game' }).click();
  await page.waitForURL('**/room/**');
}


/** Log in a host plus guests and seat them all in the host's (public) game. */
/** Rows of the players table (the word grid is a table too). */
export const playerRows = (page: Page) =>
  page.locator('table:has(th:text-is("Player")) tbody tr');

export async function seatPlayers(browser: Browser, names: string[]): Promise<Record<string, Page>> {
  const [hostName, ...guests] = names;
  const host = await login(browser, hostName);
  await host.waitForURL('**/lobby/**');
  await hostGame(host);
  const pages: Record<string, Page> = { [hostName]: host };
  for (const name of guests) {
    const page = await login(browser, name);
    await joinFromLobby(page, hostName);
    pages[name] = page;
  }
  for (const page of Object.values(pages)) {
    await expect(playerRows(page)).toHaveCount(names.length);
  }
  return pages;
}

/** Each player's round heading: "FOX ..." for the fox, "Keyword: X" for everyone else. */
export async function roleHeading(page: Page): Promise<string> {
  const heading = page.getByRole('heading', { name: /Keyword|FOX/ });
  await expect(heading).toBeVisible();
  return heading.innerText();
}

/** Start a round from the host's page; returns the fox's name and the keyword. */
export async function startRound(pages: Record<string, Page>, host: Page): Promise<{ foxName: string; keyword: string }> {
  await host.getByRole('button', { name: /Start Game|Next Round/ }).click();
  let foxName = '';
  const keywords = new Set<string>();
  for (const [name, page] of Object.entries(pages)) {
    const heading = await roleHeading(page);
    if (heading.includes('FOX')) foxName = name;
    else keywords.add(heading.replace('Keyword: ', ''));
  }
  expect(foxName).not.toBe('');
  expect(keywords.size).toBe(1);
  return { foxName, keyword: [...keywords][0] };
}

export async function submitClue(page: Page, clue: string) {
  await page.locator('input[name=clue]').fill(clue);
  await page.getByRole('button', { name: 'Submit' }).click();
}

/** Open the chat window (lobby or room) if it's closed. */
export async function openChat(page: Page) {
  const launcher = page.locator('.sc-launcher');
  if (!(await launcher.evaluate((el) => el.classList.contains('opened')))) await launcher.click();
  await expect(page.getByPlaceholder('Write a reply...')).toBeVisible();
}

export async function sendChat(page: Page, text: string) {
  await openChat(page);
  await page.getByPlaceholder('Write a reply...').fill(text);
  await page.getByPlaceholder('Write a reply...').press('Enter');
}

/** Reload, accepting the "game in progress" beforeunload prompt. */
export async function reload(page: Page) {
  page.once('dialog', (dialog) => dialog.accept());
  await page.reload();
}
