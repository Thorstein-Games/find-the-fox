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
  { label: 'Contact', href: '/contact', internal: true },
  { label: 'Report a Bug', href: 'https://find-the-fox.canny.io/feature-requests', internal: false },
];

const Footer: React.FC = () => {
  return (
    <footer className={styles.footer} role="contentinfo">
      <nav aria-label="Footer navigation" className={styles.nav}>
        <ul className={styles.linkList}>
          {links.map((link: LinkItem) => (
            <li key={link.label} className={styles.linkItem}>
              {link.internal ? (
                <Link href={link.href} className={styles.link}>
                  {link.label}
                </Link>
              ) : (
                <a href={link.href} className={styles.link} target="_blank" rel="noopener noreferrer">
                  {link.label}
                </a>
              )}
            </li>
          ))}
        </ul>

        {/* Social Media Icons */}
        <div className={styles.socialLinks}>
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
          {/* More Games Button */}
          <a
            href="https://thorsteingames.com/"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.moreGamesButton}
          >
            More Games
          </a>
        </div>
      </nav>
      <p className={styles.copy}>&copy; {new Date().getFullYear()} Find the Fox</p>
    </footer>
  );
};

export default Footer;
