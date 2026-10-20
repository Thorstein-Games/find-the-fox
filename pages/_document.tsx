import { Head, Html, Main, NextScript } from 'next/document';

import { siteConfig } from '../lib/fox/config';
import { asset } from '../lib/fox/basePath';

const GA = siteConfig.ga;
// Shared Thorstein Games bar and footer (see CLAUDE.md). `pnpm test:e2e`
// builds with this set to "" so tests don't load it from production.
const TG_BAR_SRC = process.env.NEXT_PUBLIC_TG_BAR_SRC ?? 'https://thorsteingames.com/tg-bar.js';

const Document = () => (
  <Html lang="en">
    <Head>
      <link href="https://fonts.googleapis.com/css?family=Roboto:400,700&display=swap" rel="stylesheet" />
      <link href="https://fonts.googleapis.com/css?family=Permanent+Marker&display=swap" rel="stylesheet" />
      <link rel="apple-touch-icon" sizes="180x180" href={asset('/apple-touch-icon.png')} />
      <link rel="icon" type="image/png" sizes="32x32" href={asset('/favicon-32x32.png')} />
      <link rel="icon" type="image/png" sizes="16x16" href={asset('/favicon-16x16.png')} />
      <link rel="mask-icon" href={asset('/safari-pinned-tab.svg')} color="#6366f1" />
      <meta name="theme-color" content="#ffffff" />
      {GA && (
        <>
          {/* Global Site Tag (gtag.js) - Google Analytics */}
          <script async src={`https://www.googletagmanager.com/gtag/js?id=${GA}`} />
          <script
            dangerouslySetInnerHTML={{
              __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA}', {
              page_path: window.location.pathname,
            });
          `,
            }}
          />
        </>
      )}
      {TG_BAR_SRC && <script async src={TG_BAR_SRC} />}
      {/* Google AdSense */}
      <script
        async
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9555350395401499"
        crossOrigin="anonymous"
      />
    </Head>
    <body>
      {/* Outside #__next so its tablet border doesn't wrap the bar. */}
      <tg-bar game="find-the-fox" />
      <Main />
      <NextScript />
    </body>
  </Html>
);

export default Document;
