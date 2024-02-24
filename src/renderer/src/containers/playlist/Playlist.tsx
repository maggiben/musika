import './Playlist.css';
import styled from 'styled-components';
import List from '@components/List/List';
// import { useTranslation } from 'react-i18next';
import PlayerControls from '@components/PlayerControls/PlayerControls';

const PlaylistContainer = styled.div`
  color: #484848;
  max-height: 100vh;
  overflow: hidden;
`;

const ListContainer = styled.div`
  overflow: hidden;
  overflow-y: scroll;
  max-height: 100vh;
`;

const Playlist = (): JSX.Element => {
  return (
    <PlaylistContainer>
      <PlayerControls />
      <ListContainer data-testid="list-container">
        <List />
      </ListContainer>
    </PlaylistContainer>
  );
};

export default Playlist;
