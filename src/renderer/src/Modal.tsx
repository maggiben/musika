import '@assets/styles/Modal.css';
import { Suspense, useMemo, lazy } from 'react';
import i18n from '@utils/i18n';
import { I18nextProvider } from 'react-i18next';
import styled, { ThemeProvider, createGlobalStyle } from 'styled-components';
import { RecoilRoot, useRecoilValue } from 'recoil';
import { preferencesState } from '@states/atoms';

import { defaultTheme } from '@assets/themes';
import useShowModal from '@hooks/useShowModal';
import Loading from '@containers/loading/Loading';

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
    'media-info': lazy(() => import('@renderer/containers/mediaInfo/MediaInfo')),
    'open-url': lazy(() => import('@renderer/containers/open/OpenUrl')),
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

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const ModalContent = useMemo(() => modal in modals && modals[modal], [modal]);

  return (
    <ThemeProvider theme={currentTheme}>
      <GlobalStyle />
      <Suspense fallback={<Loading />}>
        <Container>{ModalContent && <ModalContent {...preferences} options={options} />}</Container>
      </Suspense>
    </ThemeProvider>
  );
};

const Modal = (): JSX.Element => {
  const modal = useShowModal();

  return (
    <RecoilRoot>
      <I18nextProvider i18n={i18n}>
        {modal && modal.type && <ModalContainer modal={modal.type} options={modal?.options} />}
      </I18nextProvider>
    </RecoilRoot>
  );
};

export default Modal;
