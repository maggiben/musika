import { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { useRecoilState, useRecoilValue } from 'recoil';
import { playlistState } from '@states/atoms';
import { selectedItemsSelector } from '@states/selectors';
import useContextMenu from '@hooks/useContextMenu';
import { timeStringToSeconds, toHumanTime } from '@shared/lib/utils';
import { FaPlay, FaCloudDownloadAlt, FaPencilAlt, FaStop } from 'react-icons/fa';
import { BsShuffle, BsThreeDots, BsFilter, BsChevronDown } from 'react-icons/bs';
import { SpaceRight } from '../Spacing/Spacing';
import { DarwinButton, CircularButton, DarwinInputSearch, ContextMenuButton } from '../Form/Form';
import { SchedulerChannels } from '@shared/rpc-channels';
import player from '@renderer/lib/player';
import { IPlaylistItem, IPlaylistSortOptions } from 'types/types';

const PlaylistInfoContainer = styled.div`
  --thumbnail-height: 120px;
  width: 100%;
  min-height: calc(var(--thumbnail-height) + ${({ theme }) => theme.spacing.xxxl});
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;
  overflow: hidden;
  box-sizing: border-box;
  padding: ${({ theme }) => theme.spacing.xs};
`;

const StyledImg = styled.img`
  width: auto;
  max-height: var(--thumbnail-height);
  /* filter: drop-shadow(0 0 0px ${({ theme }) => theme.colors.white})
    drop-shadow(0 0 4px ${({ theme }) => theme.colors.white});
  border-radius: ${({ theme }) => theme.spacing.xxxs};
  border: 1px solid ${({ theme }) => theme.colors.white}; */
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

const InfoNav = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  width: 100%;
`;

const PlaylistTitle = styled.h1`
  margin: 0;
  color: ${({ theme }) => theme.colors.white};
`;

const PlaylistSubTitle = styled.div`
  margin: 0;
  padding: 0%;
  white-space: nowrap;
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

interface ISortOrderContextMenuMessage {
  id: string;
  checked: boolean;
  sortOptions: IPlaylistSortOptions;
}

const calcTotalPlayTime = (items: IPlaylistItem[]): number => {
  return items
    .map((item) =>
      typeof item?.duration === 'string' ? timeStringToSeconds(item.duration) : item?.duration ?? 0,
    )
    .reduce((acc, curr) => acc + curr, 0);
};

const PlaylistInfo = (): JSX.Element => {
  const { t } = useTranslation();
  const [isDownloading, setIsDownloading] = useState(false);
  const selectedItems = useRecoilValue(selectedItemsSelector);
  const [{ playlist, sortOptions }, setPlaylist] = useRecoilState(playlistState);
  const totalDuration = playlist ? calcTotalPlayTime(playlist.items) : 0;
  const downloadSelected = async (): Promise<void> => {
    const selectedItems = playlist?.items.filter(({ selected }) => Boolean(selected));
    if (selectedItems) {
      setIsDownloading(true);
      await window.commands.download(selectedItems);
      window.electron.ipcRenderer.once(SchedulerChannels.FINISHED, () => setIsDownloading(false));
    }
  };

  const stopDownloads = async (): Promise<void> => {
    setIsDownloading(false);
    window.electron.ipcRenderer.send(SchedulerChannels.STOP, {});
  };

  useContextMenu<ISortOrderContextMenuMessage>(
    ({ sortOptions }) => {
      setPlaylist((prev) => {
        if (!prev || !prev.playlist) {
          return prev;
        }
        return {
          ...prev,
          sortOptions,
        };
      });
    },
    [
      'contextmenu.playlist-sort.filter-all',
      'contextmenu.playlist-sort.filter-favorites',
      'contextmenu.playlist-sort.criteria-default',
      'contextmenu.playlist-sort.criteria-title',
      'contextmenu.playlist-sort.criteria-genere',
      'contextmenu.playlist-sort.criteria-author',
      'contextmenu.playlist-sort.criteria-year',
      'contextmenu.playlist-sort.criteria-time',
      'contextmenu.playlist-sort.ascending',
      'contextmenu.playlist-sort.descending',
    ],
  );

  const onPlaylistPlay = useCallback(() => {
    player.play();
  }, [playlist]);

  return (
    <PlaylistInfoContainer data-testid="playlist-info">
      {playlist?.thumbnail && (
        <StyledImg
          src={playlist.thumbnail.url}
          width={playlist.thumbnail.width}
          height={playlist.thumbnail.height}
          alt={t('thumbnail')}
        />
      )}
      <InfoGroup>
        <InfoNav>
          <hgroup>
            <PlaylistTitle>{playlist?.title}</PlaylistTitle>
            <PlaylistSubTitle>
              <span className="value">{playlist?.total_items}</span>
              <span>&nbsp;{t('music videos · total duration')}:&nbsp;</span>
              <span className="value">{toHumanTime(totalDuration, true)}</span>
            </PlaylistSubTitle>
          </hgroup>
          <RightActions>
            <ContextMenuButton
              onClick={async (event: React.MouseEvent<HTMLButtonElement>) => {
                const { clientX, clientY } = event;
                await window.commands.contextMenu('playlist-sort', {
                  sortOptions,
                  x: clientX,
                  y: clientY,
                });
              }}
            >
              <BsFilter />
              <SpaceRight size="xs" />
              <BsChevronDown size={'0.55rem'} />
            </ContextMenuButton>
            <SpaceRight size="m" />
            <DarwinInputSearch type="search" width={90} placeholder="Filter" />
          </RightActions>
        </InfoNav>
        <ActionGroup>
          <LeftActions>
            <DarwinButton onClick={onPlaylistPlay}>
              <FaPlay />
              <SpaceRight size="xxs" />
              {t('play')}
            </DarwinButton>
            <SpaceRight size="xs" />
            <DarwinButton>
              <BsShuffle />
              <SpaceRight size="xxs" />
              {t('shuffle')}
            </DarwinButton>
            <SpaceRight size="xs" />
            {!isDownloading ? (
              <DarwinButton
                onClick={downloadSelected}
                disabled={!selectedItems.some((item) => item)}
              >
                <FaCloudDownloadAlt />
                <SpaceRight size="xxs" />
                {t('download selected', { total: selectedItems.filter(Boolean).length })}
              </DarwinButton>
            ) : (
              <DarwinButton onClick={stopDownloads}>
                <FaStop />
                <SpaceRight size="xxs" />
                {t('stop downloads')}
              </DarwinButton>
            )}
          </LeftActions>
          <RightActions>
            <CircularButton>
              <FaPencilAlt />
            </CircularButton>
            <SpaceRight size="m" />
            <CircularButton>
              <BsThreeDots />
            </CircularButton>
          </RightActions>
        </ActionGroup>
      </InfoGroup>
    </PlaylistInfoContainer>
  );
};

export default PlaylistInfo;
