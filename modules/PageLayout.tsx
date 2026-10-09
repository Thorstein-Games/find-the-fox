import type { ReactNode } from 'react';

import Head from 'next/head';
import Image from 'next/image';

import { siteConfig } from '../lib/fox/config';
import useIsMobile from '../hooks/useIsMobile';
import { ErrorBoundary } from './ErrorBoundary';
import Footer from './Footer/Footer';

const defaultTitle = 'Find the Fox – Free Online Party Game Like The Chameleon';
const defaultDescription = `Play Find the Fox, a free online party game inspired by The Chameleon. Guess, bluff, and outsmart your friends in this hilarious hidden-identity game!`;
const baseUrl = siteConfig.url;

interface LayoutProps {
  children: ReactNode;
  description?: string;
  googleSiteVerification?: string;
  ogImage?: string;
  title?: string;
  url?: string;
  showFox?: boolean;
}

const Layout = ({
  children,
  title = '',
  description = defaultDescription,
  ogImage = '/fox.png',
  googleSiteVerification = '',
  url = '',
  showFox = false,
}: LayoutProps) => {
  const isMobile = useIsMobile();
  const finalTitle = title ? `${title} | ${defaultTitle}` : defaultTitle;
  const finalUrl = `${baseUrl}${url}`;
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
          content="find the fox, chameleon game online, chameleon online, online party game, hidden identity game, social deduction game, play chameleon online, free browser game, chameleon alternative, find the fox game online, play with friends, guessing game"
        />
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content={finalTitle} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={finalUrl} />
        <meta property="og:image" content={ogImage} />
        {/* twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content={finalUrl} />
        <meta property="twitter:title" content={finalTitle} />
        <meta property="twitter:description" content={description} />
        <meta property="twitter:image" content={ogImage} />
        {/* other */}
        {googleSiteVerification && <meta name="google-site-verification" content={googleSiteVerification} />}
      </Head>
      <div className="main-content-wrapper">
        <main>{children}</main>
        {showFox && (
          <div className="hidden-fox">
            <div className="inner-hidden-fox">
              <Image
                alt="Play Find the Fox, an online party game like The Chameleon"
                priority
                height={isMobile ? 100 : 128}
                width={isMobile ? 100 : 128}
                src="/fox.png"
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
