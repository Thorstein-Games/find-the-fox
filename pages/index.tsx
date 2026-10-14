import Head from 'next/head';

import { siteConfig } from '../lib/fox/config';
import Login from '../modules/Login';
import PageLayout from '../modules/PageLayout';

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'VideoGame',
  name: 'Find the Fox',
  alternateName: ['Chameleon Game Online', 'Play Chameleon Online'],
  url: `${siteConfig.url}/`,
  description:
    'Play chameleon online for free. Find the Fox is a chameleon game website where friends give clues, bluff and vote to catch the hidden fox.',
  genre: ['Party game', 'Social deduction', 'Word game'],
  gamePlatform: 'Web browser',
  applicationCategory: 'Game',
  operatingSystem: 'Any',
  playMode: 'MultiPlayer',
  numberOfPlayers: { '@type': 'QuantitativeValue', minValue: 3, maxValue: 12 },
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
};

// Always shows the home page. A returning player's name is pre-filled, and
// "Enter Lobby" re-claims it (a browser can always claim its own name).
const Home = () => (
  <PageLayout showFox>
    <Head>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
    </Head>
    <Login />
  </PageLayout>
);

export default Home;
