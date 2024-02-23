import './App.css';
import i18n from '@utils/i18n';
import { I18nextProvider } from 'react-i18next';
import styled, { ThemeProvider } from 'styled-components';
import { RecoilRoot } from 'recoil';
import Playlist from '@containers/playlist/Playlist';

const Container = styled.div`
  color: ${({ theme }) => theme.main};
`;

const theme = {
  main: 'red',
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
};

const App = (): JSX.Element => {
  return (
    <ThemeProvider theme={theme}>
      <RecoilRoot>
        <I18nextProvider i18n={i18n}>
          <Container>
            <Playlist />
          </Container>
        </I18nextProvider>
      </RecoilRoot>
    </ThemeProvider>
  );
};

export default App;
