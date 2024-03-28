import styled from 'styled-components';
import List from '@components/List/List';
import PlayerControls from '@components/PlayerControls/PlayerControls';
import PlaylistInfo from '@components/PlaylistInfo/PlaylistInfo';

const PlaylistContainer = styled.div`
  max-height: 100vh;
  width: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;

const ListContainer = styled.div`
  overflow: hidden;
  max-height: 100vh;
`;

const Playlist = (): JSX.Element => {
  return (
    <PlaylistContainer>
      <PlayerControls />
      <PlaylistInfo />
      <ListContainer data-testid="list-container">
        <List />
      </ListContainer>
    </PlaylistContainer>
  );
};

export default Playlist;
