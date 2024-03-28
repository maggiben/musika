import { lazy, useMemo, Suspense, useEffect } from 'react';
import styled from 'styled-components';
import { useRecoilValue } from 'recoil';
import { preferencesState } from '@states/atoms';
import Loading from '@containers/loading/Loading';

// --background-color-darker: hsl(from var(--background-color) h s calc(l - 5%));
// --background-color-darkest: hsl(from var(--background-color) h s calc(l - 10%));
const MainContainer = styled.div`
  --background-color: ${({ theme }) => theme.colors['window-background']};
  --background-color-darker: color-mix(in srgb, var(--background-color), #0000 15%);
  --background-color-darker-translucent: color-mix(in srgb, var(--background-color), #0000001f 15%);
  --background-color-darkest: color-mix(in srgb, var(--background-color), #000 30%);
  background-color: var(--background-color-darkest);
  color: #484848;
  max-height: 100vh;
  overflow: hidden;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
`;

const Main = (): JSX.Element => {
  const {
    playlists,
    behaviour: {
      sideBar: { selected },
    },
  } = useRecoilValue(preferencesState);

  const containers = {
    channels: lazy(() => import('@containers/playlist/Channels')),
    'all-playlist': lazy(() => import('@containers/playlist/AllPlaylists')),
    home: lazy(() => import('@components/ResultsHome/ResultsHome')),
    playlist: lazy(() => import('@containers/playlist/Playlist')),
  };

  const MainContent = useMemo(
    () => {
      if (selected !== null && selected !== undefined && selected !== '') {
        if (selected in containers) {
          return containers[selected];
        } else if (playlists.some(({ id }) => id === selected)) {
          return containers['playlist'];
        }
      }
      return containers['home'];
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [selected],
  );

  return (
    <MainContainer>
      <Suspense fallback={<Loading />}>{MainContent && <MainContent />}</Suspense>
    </MainContainer>
  );
};

export default Main;
