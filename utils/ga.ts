import { siteConfig } from '../lib/fox/config';

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

// log the pageview with their URL
export const pageview = (url: string) => {
  if (!siteConfig.ga) return;
  window.gtag?.('config', siteConfig.ga, {
    page_path: url,
  });
};

// log specific events happening.
export const event = ({ action, params }: { action: string; params?: Record<string, unknown> }) => {
  window.gtag?.('event', action, params);
};
