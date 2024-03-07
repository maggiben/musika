import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useRecoilValue } from 'recoil';
import ytdl from 'ytdl-core';
import ytpl from '@distube/ytpl';
import ytsr from '@distube/ytsr';
import styled from 'styled-components';
import { preferencesState } from '@states/atoms';

const SearchBarContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const SearchTerm = styled.input`
  width: 100%;
  padding-left: ${({ theme }) => theme.spacing.xxl};
  color: ${({ theme }) => theme.colors.white};
  border: 0px solid transparent;
  height: 90px;
  font-size: 40px;
  transition: all 0.2s ease;
  background: gray
    url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='26' height='26' viewBox='0 0 16 16'%3E%3Cpath fill='%23f0f0f0' d='M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z'%3E%3C/path%3E%3C/svg%3E")
    no-repeat ${({ theme }) => theme.spacing.s} center;
  &::placeholder {
    color: ${({ theme }) => theme.colors.midGray};
  }
  &:focus {
    outline: none;
  }
  &::-webkit-search-cancel-button {
    -webkit-appearance: none;
    height: 1em;
    width: 1em;
    border-radius: 50em;
    background: gray
      url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='%23fafafa' class='bi bi-x' viewBox='0 0 16 16'%3E%3Cpath d='M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708'/%3E%3C/svg%3E")
      no-repeat 50% 50%;
    background-size: contain;
    opacity: 0;
    pointer-events: none;
  }
  &:focus::-webkit-search-cancel-button {
    opacity: 0.3;
    pointer-events: all;
  }
  &:hover::-webkit-search-cancel-button {
    opacity: 0.75;
  }
  &.loading {
    // https://raw.githubusercontent.com/n3r4zzurr0/svg-spinners/main/svg-css/90-ring-with-bg.svg
    background: gray
      url("data:image/svg+xml,%3Csvg width='24' height='24' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'%3E%3Cstyle%3E.spinner_ajPY{transform-origin:center;animation:spinner_AtaB .75s infinite linear}%40keyframes spinner_AtaB{100%25{transform:rotate(360deg)}}%3C/style%3E%3Cpath d='M12,1A11,11,0,1,0,23,12,11,11,0,0,0,12,1Zm0,19a8,8,0,1,1,8-8A8,8,0,0,1,12,20Z' opacity='.25' fill='%23fafafa'/%3E%3Cpath d='M10.14,1.16a11,11,0,0,0-9,8.92A1.59,1.59,0,0,0,2.46,12,1.52,1.52,0,0,0,4.11,10.7a8,8,0,0,1,6.66-6.61A1.42,1.42,0,0,0,12,2.69h0A1.57,1.57,0,0,0,10.14,1.16Z' class='spinner_ajPY' fill='%23fafafa'/%3E%3C/svg%3E")
      no-repeat ${({ theme }) => theme.spacing.s} center;
  }
`;

interface ISearchBar {
  onSearch: (results) => void;
}
export const SearchBar = ({ onSearch }: ISearchBar): JSX.Element => {
  const preferences = useRecoilValue(preferencesState);
  const { t } = useTranslation();
  const [searchLoadingClass, setSearchLoadingClass] = useState<string>('');
  const [search, setSearch] = useState<string>(preferences.behaviour?.search?.defaultSearch ?? '');

  const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const { value } = event.target;
    setSearch(value);
  };

  const handleKeyDown = async (event: React.KeyboardEvent<HTMLInputElement>): Promise<void> => {
    if (event.key === 'Enter') {
      setSearchLoadingClass('loading');
      const searchResults = (await window.commands.search(search)) as {
        playlistId: string;
        videoId: string;
        videoInfo: ytdl.videoInfo;
        playlist: ytpl.result;
        searchResults: ytsr.PlaylistResult;
      };

      console.log('search', searchResults);
      if (searchResults.playlistId) {
        const download = await window.commands.download(search);
        console.log('download', download);
      }
      onSearch(searchResults);
      setSearchLoadingClass('');
    }
  };

  // useEffect(() => {
  //   const messageHandler = async (
  //     event: Electron.IpcRendererEvent,
  //     message: string,
  //   ): Promise<void> => {
  //     console.log('Message from main process:', message);
  //   };
  //   window.electron.ipcRenderer.on('progress', messageHandler);
  //   return () => {
  //     window.electron.ipcRenderer.removeListener('progress', messageHandler);
  //   };
  // }, []);

  return (
    <SearchBarContainer data-testid="search-wrapper">
      <SearchTerm
        type="search"
        placeholder={t('search placeholder')}
        data-testid="search-input"
        onChange={handleOnChange}
        onKeyDown={handleKeyDown}
        value={search}
        className={searchLoadingClass}
      />
    </SearchBarContainer>
  );
};

export default SearchBar;
