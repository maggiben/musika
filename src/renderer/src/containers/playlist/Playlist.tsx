import styled from 'styled-components';
import List from '@components/List/List';
import PlayerControls from '@components/PlayerControls/PlayerControls';
import PlaylistInfo from '@components/PlaylistInfo/PlaylistInfo';
import WaveSurferPlayer from '@components/WaveSurferPlayer/WaveSurferPlayer';
import song from '../../../../../test.mp3';

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
  // https://download.blender.org/peach/bigbuckbunny_movies/BigBuckBunny_320x180.mp4
  return (
    <PlaylistContainer>
      <PlayerControls />
      {song && (
        <WaveSurferPlayer
          height={100}
          waveColor="rgb(200, 0, 200)"
          progressColor="rgb(100, 0, 100)"
          url={song}
        />
      )}
      <PlaylistInfo />
      <ListContainer data-testid="list-container">
        <List />
      </ListContainer>
    </PlaylistContainer>
  );
};

export default Playlist;
