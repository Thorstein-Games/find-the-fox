import { useEffect } from 'react';

import { useRouter } from 'next/router';

import { getStoredName } from '../lib/fox/identity';
import Login from '../modules/Login';
import PageLayout from '../modules/PageLayout';

const Home = () => {
  const router = useRouter();

  // Returning players skip the name screen (the original redirected server-side on the name cookie).
  useEffect(() => {
    if (router.isReady && getStoredName() && !router.query.next) {
      router.replace('/lobby');
    }
  }, [router.isReady]);

  return (
    <PageLayout showFox>
      <Login />
    </PageLayout>
  );
};

export default Home;
