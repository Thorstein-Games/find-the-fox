import { Head, Html, Main, NextScript } from 'next/document';

import { siteConfig } from '../lib/fox/config';

const GA = siteConfig.ga;

const Document = () => (
  <Html lang="en">
    <Head>
      <link href="https://fonts.googleapis.com/css?family=Roboto:400,700&display=swap" rel="stylesheet" />
      <link href="https://fonts.googleapis.com/css?family=Permanent+Marker&display=swap" rel="stylesheet" />
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
      <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#6366f1" />
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
      {/* Google AdSense */}
      <script
        async
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9555350395401499"
        crossOrigin="anonymous"
      />
    </Head>
    <body>
      <Main />
      <NextScript />
    </body>
  </Html>
);

export default Document;
