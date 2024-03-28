import { useRecoilState } from 'recoil';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { CgPlayList } from 'react-icons/cg';
import { preferencesState } from '@renderer/states/atoms';
import {
  GridContainer,
  GridItem,
  GridThumbnail,
  GridFigure,
  GridFigCaption,
  GridThumbnailInfo,
} from '@components/Grid/Grid';
import { SpaceRight } from '@renderer/components/Spacing/Spacing';

const PlaylistsContainer = styled.div`
  max-height: 100vh;
  width: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  padding: ${({ theme }) => theme.spacing.s};
`;

const AllPlaylists = (): JSX.Element => {
  const { t } = useTranslation();
  const [preferences, setPreferences] = useRecoilState(preferencesState);
  const setSelected = (selected: string): void => {
    setPreferences((prev) => ({
      ...prev,
      behaviour: {
        ...prev.behaviour,
        sideBar: {
          ...prev.behaviour.sideBar,
          selected,
        },
      },
    }));
  };
  return (
    <PlaylistsContainer>
      <GridContainer data-testid="list-container">
        {preferences.playlists.map((playlist) => {
          return (
            <GridItem key={playlist.id} onClick={() => setSelected(playlist.id)}>
              <GridFigure>
                <GridThumbnail>
                  <img src={playlist.thumbnail?.url} />
                  <GridThumbnailInfo>
                    <CgPlayList />
                    <SpaceRight size="xxs" />
                    {t('video count', {
                      count: playlist.items.length,
                      total: playlist.items.length,
                    })}
                  </GridThumbnailInfo>
                </GridThumbnail>
                <GridFigCaption>
                  <span>{playlist.title}</span>
                </GridFigCaption>
              </GridFigure>
            </GridItem>
          );
        })}
      </GridContainer>
    </PlaylistsContainer>
  );
};

export default AllPlaylists;
