import '@assets/styles/App.css';
import { useEffect, Suspense } from 'react';
import i18n from '@utils/i18n';
import { I18nextProvider, useTranslation } from 'react-i18next';
import styled, { ThemeProvider, createGlobalStyle } from 'styled-components';
import { RecoilRoot, useRecoilState } from 'recoil';
import { preferencesState } from '@states/atoms';
import type { IpcRendererEvent } from 'electron';
import Loading from './containers/loading/Loading';
import Playlist from '@containers/playlist/Playlist';
import Download from '@containers/download/Download';
// import Preferences from '@renderer/containers/preferences/Preferences';
import { defaultTheme } from '@assets/themes';

// Global style to set the background color of the body
const GlobalStyle = createGlobalStyle`
  body {
    background-color: ${({ theme }) => theme.colors['window-background']};;
  }
`;

const Container = styled.div`
  width: 100%;
  height: 100vh;
`;

const AppContainer = ({ children }: { children: JSX.Element }): JSX.Element => {
  const { i18n } = useTranslation();
  const [preferences, setPreferences] = useRecoilState(preferencesState);
  const handleMenuClick = async (
    _event: IpcRendererEvent,
    message: { id: string },
  ): Promise<void> => {
    console.log('handleMenuClick called', message);
    switch (message?.id) {
      case 'menu.app.preferences':
        console.log('menu.app.preferences');
        await window.commands.modal('preferences');
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
      case 'contextmenu.get-media-info':
        console.log('menu.file.new.playlist');
        await window.commands.modal('media-info', { width: 600, height: 660 });
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    // Add event listener for menu bar clicks
    const removeListener = window.electron.ipcRenderer.on('menu-click', handleMenuClick);
    // Remove event listener on cleanup
    return () => {
      removeListener();
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
      <Container>{children}</Container>
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
