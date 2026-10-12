import { useEffect, useState } from 'react';

import Link from 'next/link';

import PageLayout from '../modules/PageLayout';
import { RoomPage, roomCodeFromPath } from '../modules/RoomPage';
import { stripBasePath } from '../lib/fox/basePath';

/**
 * GitHub Pages serves this for any path it has no file for - including room
 * links like /room/ABC123, which are rendered here directly so shared links
 * work on a static host.
 */
const NotFound = () => {
  const [mode, setMode] = useState<'pending' | 'room' | 'missing'>('pending');

  useEffect(() => {
    setMode(roomCodeFromPath(stripBasePath(window.location.pathname)) ? 'room' : 'missing');
  }, []);

  if (mode === 'room') return <RoomPage />;
  if (mode === 'pending') return null;

  return (
    <PageLayout title="Page Not Found" showFox>
      <div style={{ textAlign: 'center', padding: '80px 16px' }}>
        <h1>Page not found</h1>
        <p>
          That page doesn&apos;t exist. <Link href="/">Go home</Link> or head to the <Link href="/lobby">lobby</Link>.
        </p>
      </div>
    </PageLayout>
  );
};

export default NotFound;
