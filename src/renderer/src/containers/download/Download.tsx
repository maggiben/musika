// import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useRecoilState } from 'recoil';
import { playlistState } from '@states/atoms';
import SearchBar from '@renderer/components/SearchBar/SearchBar';
import ResultsHome from '@renderer/components/ResultsHome/ResultsHome';
import PlaylistInfo from '@renderer/components/PlaylistInfo/PlaylistInfo';
import List from '@renderer/components/List/List';
const DownloadContainer = styled.div`
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
  const [{ playlist }, setPlaylist] = useRecoilState(playlistState);
  const onSearch = ({ playlist }): void => {
    setPlaylist({
      playlist,
    });
  };

  return (
    <DownloadContainer>
      <SearchBar onSearch={onSearch} />
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
