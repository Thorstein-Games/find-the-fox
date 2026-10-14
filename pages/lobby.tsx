import { useFox } from '../lib/fox/FoxProvider';
import { getStoredName } from '../lib/fox/identity';
import Chat from '../modules/Chat';
import Lobby from '../modules/Lobby';
import PageLayout from '../modules/PageLayout';

const LobbyPage = () => {
  const { username, lobbyChat, sendLobbyChat } = useFox();
  return (
    <PageLayout
      showFox
      title="Lobby – Join a Chameleon Game Online"
      description="Join a public chameleon game online or host a private room to play chameleon online with friends. Free, no download."
      url="/lobby"
    >
      <Lobby />
      <Chat headerName="Lobby" playerName={username || getStoredName()} messages={lobbyChat} onSend={sendLobbyChat} />
    </PageLayout>
  );
};

export default LobbyPage;
