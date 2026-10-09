import { useFox } from '../lib/fox/FoxProvider';
import { getStoredName } from '../lib/fox/identity';
import Chat from '../modules/Chat';
import Lobby from '../modules/Lobby';
import PageLayout from '../modules/PageLayout';

const LobbyPage = () => {
  const { username, lobbyChat, sendLobbyChat } = useFox();
  return (
    <PageLayout showFox>
      <Lobby />
      <Chat headerName="Lobby" playerName={username || getStoredName()} messages={lobbyChat} onSend={sendLobbyChat} />
    </PageLayout>
  );
};

export default LobbyPage;
