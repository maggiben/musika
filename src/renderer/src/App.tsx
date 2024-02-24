// import * as utils from '@utils/utils';
// const App = (): JSX.Element => {
//   const bytes = utils.toHumanSize(1099511627776);
//   return (
//     <h1>A Hexabyte is {bytes} size</h1>
//   );
// };

// export default App;

import '@assets/styles/App.css';
import { useEffect } from 'react';
import i18n from '@utils/i18n';
import { I18nextProvider } from 'react-i18next';
import styled, { ThemeProvider, DefaultTheme } from 'styled-components';
import { RecoilRoot } from 'recoil';
import Playlist from '@containers/playlist/Playlist';
import Download from '@containers/download/Download';

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
  colors: {
    white: 'white',
    red: '#d21d30',
  },
  backgroundColor: '#212121',
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

const App = (): JSX.Element => {
  useEffect(() => {
    const handlePaste = (event: ClipboardEvent): void => {
      // Get the clipboard content
      const text = event.clipboardData?.getData('text');
      console.log('Clipboard content:', text);
    };

    // Add event listener for paste
    document.addEventListener('paste', handlePaste);

    // Remove event listener on cleanup
    return () => {
      document.removeEventListener('paste', handlePaste);
    };
  }, []);
  return (
    <ThemeProvider theme={theme}>
      <RecoilRoot>
        <I18nextProvider i18n={i18n}>
          <Container>
            <Download />
            {/* <Playlist /> */}
          </Container>
        </I18nextProvider>
      </RecoilRoot>
    </ThemeProvider>
  );
};

export default App;
