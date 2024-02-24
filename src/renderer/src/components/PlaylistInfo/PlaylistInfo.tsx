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

const StyledImg = styled.img`
  width: auto;
  max-height: 220px;
`;

const InfoGroup = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  margin-left: ${({ theme }) => theme.spacing.xs};
  margin-right: ${({ theme }) => theme.spacing.xs};
  flex-direction: column;
  justify-content: start;
  align-items: center;
`;

const StyledDescriptionList = styled.dl`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: start;
  align-items: center;
  margin: ${({ theme }) => theme.spacing.xxs};
`;

const StyledDefinitionTerm = styled.dt`
  float: left;
  clear: left;
  width: 6em;
`;

const StyledDefinitionDescription = styled.dd`
  float: left;
  margin: 0px;
`;

const InfoItem = ({ label, value }: { label: string; value: string | number }): JSX.Element => {
  return (
    <StyledDescriptionList>
      <StyledDefinitionTerm>{label}</StyledDefinitionTerm>
      <StyledDefinitionDescription>{value.toString()}</StyledDefinitionDescription>
    </StyledDescriptionList>
  );
};

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
  const description = [
    {
      label: 'title',
      value: props.title,
    },
    {
      label: 'views',
      value: props.views,
    },
  ];
  return (
    <PlaylistInfoContainer>
      <StyledImg
        src={props.thumbnail.url}
        width={props.thumbnail.width}
        height={props.thumbnail.height}
        alt={t('thumbnail')}
      />
      <InfoGroup data-testid="info-group">
        {description.map(({ label, value }) => (
          <InfoItem {...{ label, value }} />
        ))}
      </InfoGroup>
    </PlaylistInfoContainer>
  );
};

export default PlaylistInfo;
