import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

const PlaylistInfoContainer = styled.div`
  width: 100%;
  height: 220px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const StyledHeading = styled.h1`
  /* width: 100%;
  height: 100%; */
  /* color: ${({ theme }) => theme.colors.white}; */
`;

const StyledImg = styled.img`
  width: auto;
  max-height: 220px;
  /* width: 100%;
  height: 100%; */
  /* color: ${({ theme }) => theme.colors.white}; */
`;

interface IPlaylistInfoProps {
  thumbnail: {
    height: number;
    width: number;
    url: string;
  };
  title: string;
  views: number | string;
}

const PlaylistInfo = (props: IPlaylistInfoProps): JSX.Element => {
  const { t } = useTranslation();
  console.log('props', props);
  return (
    <PlaylistInfoContainer>
      <StyledImg
        src={props.thumbnail.url}
        width={props.thumbnail.width}
        height={props.thumbnail.height}
        alt="Description of the image"
      />
      <StyledHeading>{props.title}</StyledHeading>
    </PlaylistInfoContainer>
  );
};

export default PlaylistInfo;
