// import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useRecoilState } from 'recoil';
import { playlistState } from '@states/atoms';
import SearchBar from '@components/SearchBar/SearchBar';
import PlayerControls from '@components/PlayerControls/PlayerControls';
import ResultsHome from '@components/ResultsHome/ResultsHome';
import PlaylistInfo from '@components/PlaylistInfo/PlaylistInfo';
import List from '@components/List/List';
// background-color: ${({ theme }) => theme.colors.midGray};

// --background-color-darker: hsl(from var(--background-color) h s calc(l - 5%));
// --background-color-darkest: hsl(from var(--background-color) h s calc(l - 10%));
const DownloadContainer = styled.div`
  --background-color: ${({ theme }) =>
    theme.colors['window-background']}; /* any format you want here */
  --background-color-darker: color-mix(in srgb, var(--background-color), #0000 15%);
  --background-color-darker-translucent: color-mix(in srgb, var(--background-color), #0000001f 15%);
  --background-color-darkest: color-mix(in srgb, var(--background-color), #000 30%);
  background-color: var(--background-color-darkest);
  color: #484848;
  max-height: 100vh;
  overflow: hidden;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
`;

const Download = (): JSX.Element => {
  // const resetPlaylist = useResetRecoilState(playlistState);
  const [{ playlist, sortOptions }, setPlaylist] = useRecoilState(playlistState);
  const onSearch = ({ playlist }): void => {
    setPlaylist({
      playlist,
      sortOptions,
    });
  };

  return (
    <DownloadContainer>
      {/* <SearchBar onSearch={onSearch} /> */}
      <PlayerControls />
      {playlist ? (
        <>
          <PlaylistInfo
            thumbnail={playlist.thumbnail}
            title={playlist.title}
            views={playlist.views}
            totalItems={playlist.total_items}
            items={playlist.items}
          />
          <List items={playlist.items} />
        </>
      ) : (
        <ResultsHome />
      )}
    </DownloadContainer>
  );
};

export default Download;
