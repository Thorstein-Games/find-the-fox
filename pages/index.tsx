import Login from '../modules/Login';
import PageLayout from '../modules/PageLayout';

// Always shows the home page. A returning player's name is pre-filled, and
// "Enter Lobby" re-claims it (a browser can always claim its own name).
const Home = () => (
  <PageLayout showFox>
    <Login />
  </PageLayout>
);

export default Home;
