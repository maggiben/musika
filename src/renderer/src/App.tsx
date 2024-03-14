import '@assets/styles/App.css';
import { useEffect, Suspense } from 'react';
import i18n from '@utils/i18n';
import { I18nextProvider, useTranslation } from 'react-i18next';
import styled, { ThemeProvider, createGlobalStyle } from 'styled-components';
import {
  RecoilRoot,
  useRecoilState,
  useRecoilCallback,
  useResetRecoilState,
  useRecoilValue,
} from 'recoil';
import { preferencesState, playlistState } from '@states/atoms';
import type { IpcRendererEvent } from 'electron';
import Playlist from '@containers/playlist/Playlist';
import SideBar from '@renderer/components/SideBar/SideBar';
import Download from '@containers/download/Download';
// import Preferences from '@renderer/containers/preferences/Preferences';
import { defaultTheme } from '@assets/themes';
import Loading from './containers/loading/Loading';
import type ytdl from 'ytdl-core';
import type ytsr from '@distube/ytsr';
import type { IPlaylist } from 'types/types';
import useModal from '@hooks/useModal';
import useMainMenu from '@hooks/useMainMenu';

// Global style to set the background color of the body
const GlobalStyle = createGlobalStyle`
  body {
    background-color: ${({ theme }) => theme.colors['window-background']};;
  }
`;

const Container = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const AppContainer = ({ children }: { children: JSX.Element }): JSX.Element => {
  const { i18n } = useTranslation();
  const [preferences, setPreferences] = useRecoilState(preferencesState);
  const { playlist } = useRecoilValue(playlistState);
  const resetPlaylistState = useResetRecoilState(playlistState);
  const handleMenuClick = async (
    _event: IpcRendererEvent,
    message: { id: string; options?: Record<string, unknown> },
  ): Promise<void> => {
    console.log('handleMenuClick called', message);
    switch (message?.id) {
      case 'menu.app.preferences':
        console.log('menu.app.preferences');
        await window.commands.modal('preferences', { width: 520, height: 480 });
        window.electron.ipcRenderer.once('sync-preferences', async () => {
          const newPreferences = await window.preferences.loadPreferences();
          // Update Language
          preferences?.behaviour?.language !== newPreferences?.behaviour?.language &&
            i18n.changeLanguage(newPreferences?.behaviour?.language);
          setPreferences(structuredClone(newPreferences));
        });
        break;
      case 'menu.file.new.playlist':
        console.log('menu.file.new.playlist');
        await window.commands.modal('new-playlist', { width: 420, height: 580 });
        break;
      case 'menu.app.file.open-url':
        console.log('menu.app.file.open-url', message);
        await window.commands.modal('open-url', { width: 480, height: 240, ...message.options });
        break;
      default:
        break;
    }
  };

  const asyncSearch = useRecoilCallback(({ set, snapshot }) => async (url: string) => {
    try {
      const oldState = await snapshot.getPromise(playlistState);
      resetPlaylistState();
      const { playlist } = (await window.commands.search(url)) as {
        playlistId: string;
        videoId: string;
        videoInfo: ytdl.videoInfo;
        playlist: IPlaylist;
        searchResults: ytsr.PlaylistResult;
      };
      set(playlistState, {
        ...oldState,
        playlist,
      });
    } catch (error) {
      console.error(error);
    }
  });

  useModal<Record<string, unknown>>(
    async (type, message): Promise<void> => {
      switch (type) {
        case 'new-playlist':
          console.log('new-playlist');
          break;
        case 'preferences':
          console.log('preferences');
          break;
        case 'media-info':
          console.log('media-info');
          break;
        case 'open-url':
          message.url && (await asyncSearch(message.url as string));
          break;
        default:
          break;
      }
    },
    ['open-url'],
  );

  useMainMenu<{ filePath: string }>(
    async ({ filePath }) => window.playlist.savePlaylist(playlist, filePath),
    'menu.app.file.save-as',
  );

  useEffect(() => {
    // Add event listener for menu bar clicks
    const removeMenuClickListener = window.electron.ipcRenderer.on('menu-click', handleMenuClick);
    // Remove event listener on cleanup
    return () => {
      removeMenuClickListener();
    };
  }, []);
  const currentTheme = {
    ...defaultTheme,
    ...{
      ...preferences.behaviour?.theme,
      colors: {
        ...defaultTheme.colors,
        ...(preferences.behaviour?.theme?.colors ?? {}),
      },
    },
  };
  return (
    <ThemeProvider theme={currentTheme}>
      <GlobalStyle />
      <Container>
        <SideBar />
        {children}
      </Container>
    </ThemeProvider>
  );
};

const App = (): JSX.Element => {
  return (
    <RecoilRoot>
      <I18nextProvider i18n={i18n}>
        <Suspense fallback={<Loading />}>
          <AppContainer>
            <Download />
          </AppContainer>
        </Suspense>
      </I18nextProvider>
    </RecoilRoot>
  );
};

export default App;
