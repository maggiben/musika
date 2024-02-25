import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import ytpl from '@distube/ytpl';
import ytdl from 'ytdl-core';
import styled from 'styled-components';

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
    url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 16 16'%3E%3Cpath d='M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z'%3E%3C/path%3E%3C/svg%3E")
    no-repeat ${({ theme }) => theme.spacing.s} center;
  &::placeholder {
    color: ${({ theme }) => theme.colors.white};
  }
  &:focus {
    outline: none;
  }
  &::-webkit-search-cancel-button {
    -webkit-appearance: none;
    height: 1em;
    width: 1em;
    border-radius: 50em;
    background: url(https://pro.fontawesome.com/releases/v5.10.0/svgs/solid/times-circle.svg)
      no-repeat 50% 50%;
    background-size: contain;
    opacity: 0;
    pointer-events: none;
  }
  &:focus::-webkit-search-cancel-button {
    opacity: 0.3;
    pointer-events: all;
  }
  &.loading {
    background: gray
      url(https://raw.githubusercontent.com/n3r4zzurr0/svg-spinners/main/svg-css/90-ring-with-bg.svg)
      no-repeat ${({ theme }) => theme.spacing.s} center;
  }
`;

interface ISearchBar {
  onSearch: (results) => void;
}
export const SearchBar = ({ onSearch }: ISearchBar): JSX.Element => {
  const { t } = useTranslation();
  const [searchLoadingClass, setSearchLoadingClass] = useState<string>('');
  const [search, setSearch] = useState<string>(
    'https://youtube.com/watch?v=nRfDgXdInoM&list=PL_xObc8HwOwtwHHn7dZCsst07KMv6lzo9&index=2',
  );

  const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const { value } = event.target;
    setSearch(value);
  };

  const handleKeyDown = async (event: React.KeyboardEvent<HTMLInputElement>): Promise<void> => {
    if (event.key === 'Enter') {
      setSearchLoadingClass('loading');
      const datum = (await window.commands.getVideoInfo(search)) as {
        playlistId: string;
        videoId: string;
        playlist: ytpl.result;
        videoInfo: ytdl.videoInfo;
      };
      console.log('datum', datum);
      const download = await window.commands.download(search);
      console.log('download', download);
      onSearch(datum);
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
        defaultValue="https://youtube.com/watch?v=nRfDgXdInoM&list=PL_xObc8HwOwtwHHn7dZCsst07KMv6lzo9&index=2"
        className={searchLoadingClass}
      />
    </SearchBarContainer>
  );
};

export default SearchBar;
