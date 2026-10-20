import Link from 'next/link';

import FacebookIcon from '../SVG/FacebookIcon';
import PatreonIcon from '../SVG/PatreonIcon';
import styles from './Footer.module.scss';

interface LinkItem {
  label: string;
  href: string;
  internal: boolean;
}

const links: LinkItem[] = [
  { label: 'Home', href: '/', internal: true },
  { label: 'Lobby', href: '/lobby', internal: true },
  { label: 'How to Play', href: '/how-to-play', internal: true },
  { label: 'FAQ', href: '/faq', internal: true },
  { label: 'Why Play?', href: '/why-to-play', internal: true },
  { label: 'Report a Bug', href: 'https://find-the-fox.canny.io/feature-requests', internal: false },
];

// The shared Thorstein Games footer (tg-bar.js, see CLAUDE.md) with Find the
// Fox's own links and social icons in it, and the page's banner ad above it.
const Footer: React.FC = () => {
  return (
    <>
      <tg-ad game="find-the-fox" format="banner" className={styles.ad} />
      <tg-footer game="find-the-fox">
        {links.map((link: LinkItem) =>
          link.internal ? (
            <Link key={link.label} href={link.href} className={styles.link}>
              {link.label}
            </Link>
          ) : (
            <a key={link.label} href={link.href} className={styles.link} target="_blank" rel="noopener noreferrer">
              {link.label}
            </a>
          ),
        )}
        <a
          href="https://www.facebook.com/findthefoxgame"
          target="_blank"
          rel="noopener noreferrer"
          className={`${styles.socialIcon} ${styles.facebookIcon}`}
          aria-label="Follow us on Facebook"
        >
          <FacebookIcon />
        </a>
        <a
          href="https://patreon.com/ThorsteinGames"
          target="_blank"
          rel="noopener noreferrer"
          className={`${styles.socialIcon} ${styles.patreonIcon}`}
          aria-label="Support us on Patreon"
        >
          <PatreonIcon />
        </a>
      </tg-footer>
    </>
  );
};

export default Footer;
