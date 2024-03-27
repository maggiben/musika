import { useRecoilValue } from 'recoil';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { CgPlayList } from 'react-icons/cg';
import { preferencesState } from '@renderer/states/atoms';
import { SpaceRight } from '@renderer/components/Spacing/Spacing';

const PlaylistContainer = styled.div`
  max-height: 100vh;
  width: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  padding: ${({ theme }) => theme.spacing.xs};
`;

const GridContainer = styled.ul`
  box-sizing: border-box;
  list-style: none;
  padding: 0px;
  max-width: 100%;
  margin: 0px;
  overflow-y: scroll;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  grid-gap: 1em;
`;

const GridItem = styled.li`
  padding: 0px;
  margin: 0px;
`;

const GridThumbnail = styled.div`
  position: relative;
  & > img {
    border-radius: ${({ theme }) => theme.borderRadius.xs};
  }
`;

const GridFigure = styled.figure`
  padding: 0px;
  margin: 0px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-direction: column;
  line-height: 1em;
  & ${GridThumbnail} > img {
    max-width: 100%;
  }
`;

const GridFigCaption = styled.figcaption`
  padding: 0px;
  margin: 0px;
  max-width: 100%;
  display: flex;
  flex-direction: row;
  margin-top: ${({ theme }) => theme.spacing.xs};
  color: ${({ theme }) => theme.colors.lightGray};
  & > span.value {
    font-weight: bold;
    color: ${({ theme }) => theme.colors.white};
  }
`;

const GridThumbnailInfo = styled.span`
  position: absolute;
  white-space: nowrap;
  border-radius: ${({ theme }) => theme.borderRadius.xxs};
  background-color: rgba(0, 0, 0, 0.75);
  right: calc(0px + ${({ theme }) => theme.spacing.xs});
  bottom: calc(0px + ${({ theme }) => theme.spacing.xs});
  display: flex;
  justify-content: center;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.xxs};
  color: ${({ theme }) => theme.colors.white};
`;

const AllPlaylists = (): JSX.Element => {
  const { t } = useTranslation();
  const preferences = useRecoilValue(preferencesState);
  return (
    <PlaylistContainer>
      <GridContainer data-testid="list-container">
        {preferences.playlists.map((playlist) => {
          return (
            <GridItem key={playlist.id}>
              <GridFigure>
                <GridThumbnail>
                  <img src={playlist.thumbnail?.url} />
                  <GridThumbnailInfo>
                    <CgPlayList />
                    <SpaceRight size="xxs" />
                    {`${preferences.playlists.length.toString()} ${t('videos')}`}
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
    </PlaylistContainer>
  );
};

export default AllPlaylists;
