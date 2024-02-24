import { useEffect } from 'react';
// import { ipcRenderer } from 'electron';
import { useState } from 'react';
// import * as ytdl from 'ytdl-core';
import styled from 'styled-components';


const SearchBarWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const SearchTerm = styled.input`
  width: 100%;
  padding-left: ${({ theme }) => theme.spacing.xxl};
  color: ${({ theme }) => theme.color};
  margin: ${({ theme }) => theme.spacing.xs};
  border: 0px solid transparent;
  height: 118px;
  font-size: 40px;
  transition: all .2s ease;
  background: gray url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 16 16'%3E%3Cpath d='M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z'%3E%3C/path%3E%3C/svg%3E") no-repeat ${({ theme }) => theme.spacing.s} center;
  &::placeholder {
    color: ${({ theme }) => theme.color};
  }
  &:focus {
    outline: none;
  }
  &::-webkit-search-cancel-button {
    -webkit-appearance: none;
    height: 1em;
    width: 1em;
    border-radius: 50em;
    background: url(https://pro.fontawesome.com/releases/v5.10.0/svgs/solid/times-circle.svg) no-repeat 50% 50%;
    background-size: contain;
    opacity: 0;
    pointer-events: none;
  }
  &:focus::-webkit-search-cancel-button {
    opacity: .3;
    pointer-events: all;
  }

`;

export const SearchBar = () => {
  const [search, setSearch] = useState<string>('https://www.youtube.com/watch?v=q2ZHjSA8mkY&list=PLF48AC0919899FFED');

  const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    console.log('search', value);
    setSearch(value);
  };

  const handleKeyDown = async (event: React.KeyboardEvent<HTMLInputElement>) => {
    console.log('Key pressed:', event.key);
    if (event.key === 'Enter') {
      const datum = await window.electron.getVideoInfo(search);
      console.log('datum', datum);
    }
  };

  useEffect(() => {
    const messageHandler = (event: Electron.IpcRendererEvent, message: string) => {
      console.log('Message from main process:', message);
    };
    window.ipcRenderer.on('progress', messageHandler);
    return () => {
      window.ipcRenderer.removeListener('progress', messageHandler);
    };
  }, []);

  // const getVideoInfo = async(url: string): Promise<ytdl.videoInfo> => {
  //   try {
  //     return await ytdl.getInfo(url);
  //   } catch (error) {
  //     throw new Error((error as Error).message);
  //   }
  // }

  return (
    <SearchBarWrapper data-testid="search-wrapper">
      <SearchTerm type="search" placeholder="What are you looking for?" data-testid="search-input" onChange={handleOnChange} onKeyDown={handleKeyDown} defaultValue="https://www.youtube.com/watch?v=q2ZHjSA8mkY&list=PLF48AC0919899FFED"/>
    </SearchBarWrapper>
  );
}

const Download = () => {
  return (
    <SearchBar />
  );
};

export default Download;