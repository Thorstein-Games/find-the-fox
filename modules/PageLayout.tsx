import type { ReactNode } from 'react';

import Head from 'next/head';
import Image from 'next/image';

import { siteConfig } from '../lib/fox/config';
import useIsMobile from '../hooks/useIsMobile';
import { ErrorBoundary } from './ErrorBoundary';
import Footer from './Footer/Footer';
import { asset } from '../lib/fox/basePath';

// SEO: Search Console shows most of our traffic searching for The Chameleon
// ("play chameleon online", "chameleon game online", "chameleon game website",
// "chameleon game online with friends"), so titles, descriptions and headings
// lead with those phrases while keeping the Find the Fox brand.
const homeTitle = 'Play Chameleon Online – Free Chameleon Game with Friends | Find the Fox';
const titleSuffix = 'Find the Fox – Chameleon Game Online';
const defaultDescription =
  'Play chameleon online for free with Find the Fox, the chameleon game website for friends. No download or sign-up: create a room, share the link, give clues and catch the hidden fox in your browser.';
const keywords = [
  'play chameleon online',
  'chameleon game online',
  'chameleon game online with friends',
  'chameleon game website',
  'the chameleon game online',
  'chameleon online free',
  'find the fox',
  'find the fox game online',
  'online party game',
  'hidden identity game',
  'social deduction game',
  'word game with friends',
  'free browser game',
].join(', ');
const baseUrl = siteConfig.url;

interface LayoutProps {
  children: ReactNode;
  description?: string;
  googleSiteVerification?: string;
  ogImage?: string;
  title?: string;
  url?: string;
  showFox?: boolean;
  /** Keep the page out of search results (game rooms, 404). */
  noIndex?: boolean;
}

const Layout = ({
  children,
  title = '',
  description = defaultDescription,
  ogImage = '/fox.png',
  googleSiteVerification = '',
  url = '',
  showFox = false,
  noIndex = false,
}: LayoutProps) => {
  const isMobile = useIsMobile();
  const finalTitle = title ? `${title} | ${titleSuffix}` : homeTitle;
  const finalUrl = `${baseUrl}${url}`;
  // Open Graph needs an absolute image URL.
  const finalOgImage = /^https?:\/\//.test(ogImage) ? ogImage : `${baseUrl}${asset(ogImage)}`;
  return (
    <ErrorBoundary>
      <Head>
        {/* design */}
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {/* Primary SEO */}
        <title>{finalTitle}</title>
        <meta name="title" content={finalTitle} />
        <meta name="description" content={description} />
        <meta
          name="keywords"
          content={keywords}
        />
        {noIndex && <meta name="robots" content="noindex" />}
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Find the Fox" />
        <meta property="og:title" content={finalTitle} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={finalUrl} />
        <meta property="og:image" content={finalOgImage} />
        {/* twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content={finalUrl} />
        <meta property="twitter:title" content={finalTitle} />
        <meta property="twitter:description" content={description} />
        <meta property="twitter:image" content={finalOgImage} />
        {/* other */}
        {googleSiteVerification && <meta name="google-site-verification" content={googleSiteVerification} />}
      </Head>
      <div className="main-content-wrapper">
        <main>{children}</main>
        {showFox && (
          <div className="hidden-fox">
            <div className="inner-hidden-fox">
              <Image
                alt="Find the Fox – play the chameleon game online with friends"
                priority
                height={isMobile ? 100 : 128}
                width={isMobile ? 100 : 128}
                src={asset('/fox.png')}
              />
              <div className="hidden-fox-words">
                <h3>
                  Fox
                  <br />
                  Keep Hidden
                </h3>
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </ErrorBoundary>
  );
};

export default Layout;
