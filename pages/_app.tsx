import { useEffect } from 'react';

import type { AppProps } from 'next/app';
import { useRouter } from 'next/router';

import { FoxProvider } from '../lib/fox/FoxProvider';
import '../styles/global.scss';
import { pageview } from '../utils/ga';

const MyApp = ({ Component, pageProps }: AppProps) => {
  const router = useRouter();

  useEffect(() => {
    const handleRouteChange = (url: string) => {
      pageview(url);
    };
    // Log page views on client-side navigation
    router.events.on('routeChangeComplete', handleRouteChange);
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router.events]);

  return (
    <FoxProvider>
      <Component {...pageProps} />
    </FoxProvider>
  );
};

export default MyApp;
