/**
 * Where the site is mounted. "" at a domain root (find-the-fox.com); e.g.
 * "/find-the-fox" on a GitHub Pages project URL
 * (thorstein-games.github.io/find-the-fox/). Set at build time via
 * NEXT_PUBLIC_BASE_PATH (the deploy workflow takes it from GitHub Pages).
 *
 * next/link and router.push add it automatically; raw paths (img/audio src,
 * <link> tags, share URLs, reading window.location) must use these helpers.
 */
export const basePath = (process.env.NEXT_PUBLIC_BASE_PATH ?? '').replace(/\/+$/, '');

/** Prefix a root-relative public asset path, e.g. asset('/fox.png'). */
export const asset = (path: string) => `${basePath}${path}`;

/** The app-relative path of a browser pathname (base path removed). */
export function stripBasePath(pathname: string): string {
  if (basePath && (pathname === basePath || pathname.startsWith(`${basePath}/`))) {
    return pathname.slice(basePath.length) || '/';
  }
  return pathname;
}
