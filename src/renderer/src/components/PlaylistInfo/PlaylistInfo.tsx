import { useTranslation } from 'react-i18next';
import type ytpl from '@distube/ytpl';
import styled from 'styled-components';
import { useRecoilState } from 'recoil';
import { playlistState } from '@renderer/states/atoms';
import { DarwinButton, CircularButton } from '../Form/Form';
import { SpaceRight } from '../Spacing/Spacing';
import { timeStringToSeconds, toHumanTime } from '@shared/lib/utils';
import { FaPlay } from '@react-icons/all-files/fa/FaPlay';
import { BsShuffle } from '@react-icons/all-files/bs/BsShuffle';
import { FaCloudDownloadAlt } from '@react-icons/all-files/fa/FaCloudDownloadAlt';
import { FaPencilAlt } from '@react-icons/all-files/fa/FaPencilAlt';
import { BsThreeDots } from '@react-icons/all-files/bs/BsThreeDots';

const PlaylistInfoContainer = styled.div`
  --thumbnail-height: 120px;
  width: 100%;
  min-height: 140px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;
  overflow: hidden;
`;

const StyledImg = styled.img`
  width: auto;
  max-height: var(--thumbnail-height);
  -webkit-box-reflect: below 1px
    linear-gradient(
      to bottom,
      rgba(0, 0, 0, 0) 0%,
      rgba(0, 0, 0, 0) calc(var(--thumbnail-height) - ${({ theme }) => theme.spacing.l}),
      rgba(0, 0, 0, 0.3) 100%
    );
`;

const InfoGroup = styled.div`
  width: 100%;
  height: 100%;
  max-height: var(--thumbnail-height);
  display: flex;
  margin-left: ${({ theme }) => theme.spacing.xs};
  margin-right: ${({ theme }) => theme.spacing.xs};
  flex-direction: column;
  justify-content: start;
  align-items: center;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
`;

const PlaylistTitle = styled.h1`
  margin: 0;
  color: ${({ theme }) => theme.colors.white};
`;

const PlaylistSubTitle = styled.p`
  margin: 0;
  padding: 0%;
  font-size: 0.85rem;
  color: ${({ theme }) => theme.colors.lightGray};
  & > span.value {
    font-weight: bold;
    color: ${({ theme }) => theme.colors.white};
  }
`;

const ActionGroup = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: center;
`;

const LeftActions = styled.div`
  flex: 1;
  display: flex;
  width: 100%;
  justify-content: flex-start;
  align-items: center;
`;

const RightActions = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
`;

interface IPlaylistInfoProps {
  thumbnail: {
    height: number;
    width: number;
    url: string;
  };
  title: string;
  views: number | string;
  totalItems: number;
  items: ytpl.result['items'];
}

const calcTotalPlayTime = (items: ytpl.result['items']): number => {
  return items
    .map((item) => (item.duration ? timeStringToSeconds(item.duration) : 0))
    .reduce((acc, curr) => acc + curr, 0);
};

const PlaylistInfo = (props: IPlaylistInfoProps): JSX.Element => {
  const { t } = useTranslation();
  const [{ playlist }, setPlaylist] = useRecoilState(playlistState);
  const totalDuration = calcTotalPlayTime(props.items);
  const downloadSelected = (): void => {
    const selectedItems = playlist?.items.filter(({ selected }) => Boolean(selected));
    console.log('selectedItems', selectedItems);
  };

  return (
    <PlaylistInfoContainer>
      <StyledImg
        src={props.thumbnail.url}
        width={props.thumbnail.width}
        height={props.thumbnail.height}
        alt={t('thumbnail')}
      />
      <InfoGroup>
        <hgroup>
          <PlaylistTitle>{props.title}</PlaylistTitle>
          <PlaylistSubTitle>
            <span className="value">{props.totalItems}</span>
            <span>&nbsp;MUSIC VIDEOS · TOTAL DURATION:&nbsp;</span>
            <span className="value">{toHumanTime(totalDuration)}</span>
          </PlaylistSubTitle>
        </hgroup>
        <ActionGroup>
          <LeftActions>
            <DarwinButton>
              <FaPlay />
              Play
            </DarwinButton>
            <SpaceRight size="xs" />
            <DarwinButton
              onClick={async () => {
                await window.commands.contextMenu('playlist', { ...playlist });
              }}
            >
              <BsShuffle /> Shuffle
            </DarwinButton>
            <SpaceRight size="xs" />
            <DarwinButton onClick={downloadSelected}>
              <FaCloudDownloadAlt />
              Download Selected
            </DarwinButton>
          </LeftActions>
          <RightActions>
            <CircularButton>
              <FaPencilAlt />
            </CircularButton>
            <SpaceRight size="m" />
            <CircularButton
              onClick={async () => {
                await window.commands.contextMenu('playlist');
              }}
            >
              <BsThreeDots />
            </CircularButton>
          </RightActions>
        </ActionGroup>
      </InfoGroup>
    </PlaylistInfoContainer>
  );
};

export default PlaylistInfo;
