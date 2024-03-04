import '@assets/styles/Modal.css';
import { useEffect, Suspense, useState } from 'react';
import i18n from '@utils/i18n';
import { I18nextProvider } from 'react-i18next';
import styled, { ThemeProvider, DefaultTheme } from 'styled-components';
import { RecoilRoot } from 'recoil';
import Preferences from '@renderer/containers/preferences/Preferences';

const Container = styled.div`
  width: 100%;
  height: 100vh;
`;

const theme: DefaultTheme = {
  main: 'red',
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
    white: 'var(--color-white)',
    black: 'var(--color-black)',
    // blue
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

const Modal = (): JSX.Element => {
  const [showModal, setShowModa] = useState<boolean>(false);

  const handleMenuClick = (_event, message): void => {
    console.log('handleMenuClick', message);
    if (!showModal) {
      window.electron.ipcRenderer.send('show-modal', message);
    } else {
      window.electron.ipcRenderer.send('hide-modal', message);
    }
  };
  useEffect(() => {
    const handlePaste = (event: ClipboardEvent): void => {
      // Get the clipboard content
      const text = event.clipboardData?.getData('text');
      console.log('Clipboard content:', text);
    };

    // Add event listener for paste
    document.addEventListener('paste', handlePaste);
    // Use contextBridge
    window.electron.ipcRenderer.on('menu-click', handleMenuClick);

    // Remove event listener on cleanup
    return () => {
      document.removeEventListener('paste', handlePaste);
      if (
        'off' in window.electron.ipcRenderer &&
        typeof window.electron.ipcRenderer.off === 'function'
      ) {
        window.electron.ipcRenderer.off('menu-click', handleMenuClick);
      }
    };
  }, []);
  return (
    <ThemeProvider theme={theme}>
      <RecoilRoot>
        <I18nextProvider i18n={i18n}>
          <Container>
            <Suspense fallback={<div>Loading...</div>}>
              <Preferences />
            </Suspense>
          </Container>
        </I18nextProvider>
      </RecoilRoot>
    </ThemeProvider>
  );
};

export default Modal;
