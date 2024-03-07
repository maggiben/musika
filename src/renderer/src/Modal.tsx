import '@assets/styles/Modal.css';
import { useEffect, Suspense, useState, useMemo, lazy } from 'react';
import i18n from '@utils/i18n';
import { I18nextProvider, useTranslation } from 'react-i18next';
import styled, { ThemeProvider, DefaultTheme } from 'styled-components';
import { RecoilRoot, useRecoilState, useRecoilValue } from 'recoil';
import type { IpcRendererEvent } from 'electron';
import { preferencesState } from '@states/atoms';
import Loading from './containers/loading/Loading';
// import Preferences from '@renderer/containers/preferences/Preferences';
import NewPlaylist from './containers/playlist/NewPlaylist';

const Container = styled.div`
  width: 100%;
  height: 100vh;
`;

const theme: DefaultTheme = {
  fontFamily: {
    primary: 'Roboto, sans-serif',
    mono: '"Roboto Mono", monospace',
  },
  animation: {
    duration: '200ms',
    timingFunction: 'ease-in-out',
  },
  transition: {
    duration: '200ms',
    timingFunction: 'ease-in-out',
  },
  fontSizes: {
    xxxs: '10px',
    xxs: '12px',
    xs: '14px',
    s: '16px',
    m: '20px',
    l: '24px',
    xl: '32px',
    xxl: '40px',
  },
  lineHeights: {
    xs: '0.5',
    m: '1',
    l: '1.5',
  },
  colors: {
    accentColor: '#007AFFFF',
    white: 'var(--color-white)',
    black: 'var(--color-black)',
    blue: '#0000ff',
    // brown
    // gray
    // green
    // orange
    // pink
    // purple
    // yellow
    red: '#d21d30',
    darkGray: 'var(--color-darkdray)',
    softGray: '#3b3b3b',
    midGray: '#484848',
    lightGray: '#858585',
    violet: '#6400ff',
  },
  spacing: {
    xxxs: '2px',
    xxs: '4px',
    xs: '8px',
    s: '12px',
    m: '16px',
    l: '24px',
    xl: '32px',
    xxl: '48px',
    xxxl: '64px',
  },
  borderRadius: {
    xxxs: '2px',
    xxs: '4px',
    xs: '8px',
    s: '12px',
    m: '16px',
    l: '24px',
    xl: '32px',
  },
};

window.electron.ipcRenderer.on('test', (_event, message) => {
  console.log('test in modal 2', message);
});

const ModalContainer = ({ modalType }: { modalType: string }): JSX.Element => {
  const preferences = useRecoilValue(preferencesState);

  // import Preferences from '@renderer/containers/preferences/Preferences';
  // import NewPlaylist from './containers/playlist/NewPlaylist';
  const modals = {
    preferences: lazy(() => import('@renderer/containers/preferences/Preferences')),
    'new-playlist': lazy(() => import('@renderer/containers/playlist/NewPlaylist')),
    playlist: lazy(() => import('@renderer/containers/playlist/Playlist')),
  };

  // useEffect(() => {
  //   console.log('call use effect !');
  //   window.electron.ipcRenderer.on('test', (_event, message) => {
  //     console.log('test in modal', message);
  //   });
  //   window.electron.ipcRenderer.on(
  //     'show-modal',
  //     // eslint-disable-next-line @typescript-eslint/no-unused-vars
  //     (_event, type: string, options: Record<string, unknown>) => {
  //       console.log('show-modal in modal', type, options);
  //       setModalType(type);
  //     },
  //   );
  // }, []);

  const ModalContent = modals[modalType];

  return (
    <ThemeProvider theme={theme}>
      <Suspense fallback={<Loading />}>
        <Container>
          <ModalContent {...preferences} />
        </Container>
      </Suspense>
    </ThemeProvider>
  );
};

const Modal = (): JSX.Element => {
  const [modalType, setModalType] = useState<string | undefined>(undefined);
  const showModalListener = (
    _event: IpcRendererEvent,
    type: string,
    options: Record<string, unknown>,
  ): void => {
    setModalType(type);
  };
  const handleKeyDown = (event: KeyboardEvent): void => {
    if (event.key === 'Escape') {
      window.electron.ipcRenderer.send('hide-modal', {
        sync: false,
      });
    }
  };
  useEffect(() => {
    const removeShowModalListener = window.electron.ipcRenderer.on('show-modal', showModalListener);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      removeShowModalListener();
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <RecoilRoot>
      <Suspense fallback={<Loading />}>
        <I18nextProvider i18n={i18n}>
          {modalType && <ModalContainer modalType={modalType} />}
        </I18nextProvider>
      </Suspense>
    </RecoilRoot>
  );
};

export default Modal;
