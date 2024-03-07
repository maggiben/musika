import '@assets/styles/Modal.css';
import { useEffect, Suspense, useState, lazy } from 'react';
import i18n from '@utils/i18n';
import { I18nextProvider } from 'react-i18next';
import styled, { ThemeProvider, createGlobalStyle } from 'styled-components';
import { RecoilRoot, useRecoilValue } from 'recoil';
import type { IpcRendererEvent } from 'electron';
import useCloseOnEscapeKey from '@hooks/useCloseOnEscapeKey';
import { preferencesState } from '@states/atoms';
import Loading from './containers/loading/Loading';
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

const ModalContainer = ({
  modal,
  options,
}: {
  modal: string;
  options?: Record<string, unknown>;
}): JSX.Element => {
  const preferences = useRecoilValue(preferencesState);

  const modals = {
    preferences: lazy(() => import('@renderer/containers/preferences/Preferences')),
    'new-playlist': lazy(() => import('@renderer/containers/playlist/NewPlaylist')),
  };

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

  const ModalContent = modals[modal];

  return (
    <ThemeProvider theme={currentTheme}>
      <GlobalStyle />
      <Suspense fallback={<Loading />}>
        <Container>
          <ModalContent {...preferences} options={options} />
        </Container>
      </Suspense>
    </ThemeProvider>
  );
};

const Modal = (): JSX.Element => {
  useCloseOnEscapeKey();
  const [modal, setModal] = useState<
    | {
        type?: string;
        options?: Record<string, unknown>;
      }
    | undefined
  >(undefined);
  const showModalListener = (
    _event: IpcRendererEvent,
    type: string,
    options?: Record<string, unknown>,
  ): void => {
    setModal({
      type,
      options,
    });
  };

  useEffect(() => {
    const removeShowModalListener = window.electron.ipcRenderer.on('show-modal', showModalListener);
    return () => {
      removeShowModalListener();
    };
  }, []);

  return (
    <RecoilRoot>
      <I18nextProvider i18n={i18n}>
        <Suspense fallback={<Loading />}>
          {modal && modal.type && <ModalContainer modal={modal.type} options={modal?.options} />}
        </Suspense>
      </I18nextProvider>
    </RecoilRoot>
  );
};

export default Modal;
