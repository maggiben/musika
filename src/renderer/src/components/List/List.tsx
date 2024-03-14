import React, { useEffect, useRef } from 'react';
import Stars from '@components/Stars/Stars';
import styled, { css } from 'styled-components';
import { padZeroes } from '@utils/string';
import * as utils from '@shared/lib/utils';
import { useRecoilState, useRecoilValue } from 'recoil';
import { BsThreeDots } from 'react-icons/bs';
import useDownload from '@hooks/useDownload';
import useFakeProgress from '@hooks/useFakeProgress';
import { ClearButton } from '@components/Form/Form';
import { SpaceRight } from '@components/Spacing/Spacing';
import { playlistState } from '@states/atoms';
import { selectedItemsSelector } from '@states/selectors';
import SelectAllCheckbox from './SelectAllCheckbox';
import { IPlaylist, IPlaylistItem } from 'types/types';
import useContextMenu from '@renderer/hooks/useContextMenu';
import sortPlaylist from './sortPlaylist';

const SongIndex = styled.span`
  user-select: none;
  font-family: ${({ theme }) => theme.fontFamily.mono};
  margin-left: ${({ theme }) => theme.spacing.xxs};
`;

const SongName = styled.p`
  text-align: left;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  margin: 0px;
`;

const SongDuration = styled.span`
  font-family: ${({ theme }) => theme.fontFamily.mono};
  margin-right: ${({ theme }) => theme.spacing.xxs};
`;

const ListBase = css`
  flex-grow: 1;
  padding: 0px;
  margin: 0px;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  overflow-y: hidden;
  & > span {
    min-width: 0;
    z-index: 0;
    /* Checkbox */
    &:nth-child(1) {
      text-align: right;
      font-weight: bold;
    }
    /* Index */
    &:nth-child(2) {
      text-align: right;
    }
    /* Dot */
    &:nth-child(3) {
      flex-basis: content;
      margin: 0px 6px;
      text-align: center;
      font-weight: bold;
    }
    /* Title */
    &:nth-child(4) {
      flex-basis: 65%;
      flex-grow: 1;
    }
    /* Stars */
    &:nth-child(5) {
      flex-basis: 10%;
      text-align: right;
      align-self: flex-end;
    }
    /* Duration */
    &:nth-child(6) {
      flex-basis: 15%;
      text-align: right;
      align-self: flex-end;
    }
    /* Menu */
    &:nth-child(7) {
      text-align: center;
      align-self: flex-end;
    }
  }
`;

const ListBack = styled.div`
  ${ListBase}
  box-sizing: border-box;
  padding: ${({ theme }) => theme.spacing.xs};
  top: 0;
  left: 0;
  color: ${({ theme }) => theme.colors.white};
  & > span:nth-child(4) {
    & .full {
      color: ${({ theme }) => theme.colors.white};
    }
  }
`;

const ListFront = styled.div<{ $progress: number[] | undefined }>`
  ${ListBase}
  box-sizing: border-box;
  padding: ${({ theme }) => theme.spacing.xs};
  color: ${({ theme }) => theme.colors.lightGray};
  position: absolute;
  top: 0;
  left: 0;
  ${({ $progress }) =>
    $progress &&
    css`
      clip-path: inset(0 0 0 ${$progress[1]}%);
      transition-property: clip-path;
      transition-duration: ${({ theme }) => theme.transition.duration};
      transition-timing-function: ${({ theme }) => theme.transition.timingFunction};
    `}
`;

const ListWrapper = styled.ul`
  flex-grow: 1;
  list-style: none;
  padding: 0px;
  margin: 0px;
  width: 100%;
  overflow-y: scroll;
`;

const ListItemWrapper = styled.li<{ $progress?: number[] }>`
  position: relative;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  user-select: none;
  cursor: default;
  &::before {
    content: '';
    position: absolute;
    height: 100%;
    background: ${({ theme }) => theme.colors.red};
    z-index: 0;
    left: 0;
    ${({ $progress }) =>
      $progress &&
      css`
        width: ${$progress[1]}%;
        transition-property: width;
        transition-duration: ${({ theme }) => theme.transition.duration};
        transition-timing-function: ${({ theme }) => theme.transition.timingFunction};
      `}
  }
`;

const ListHeader = styled.li`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  min-height: ${({ theme }) => theme.spacing.xs};
  border-top: 1px solid ${({ theme }) => theme.colors['separator']};
  border-bottom: 1px solid ${({ theme }) => theme.colors['separator']};
  &:first-child {
    position: sticky;
    top: 0; /* Stick to the top of the container */
    background-color: var(--background-color-darker-translucent);
    z-index: 1;
  }
`;

const List = (): JSX.Element | null => {
  useContextMenu<{
    id: string;
    options?: Record<string, unknown>;
  }>(
    (message) => {
      window.commands.modal('media-info', { width: 600, height: 660, ...message.options });
    },
    ['contextmenu.playlist-item.get-media-info'],
  );

  const [{ playlist, sortOptions }, setPlaylist] = useRecoilState(playlistState);
  const [, setSelectedItems] = useRecoilState(selectedItemsSelector);
  const progress = useDownload();
  // const progress = useFakeProgress({
  //   items: playlist?.items ?? [],
  // });

  const handleItemSelect = (event: React.ChangeEvent<HTMLInputElement>): void => {
    if (!playlist) return;
    const { checked } = event.target;
    const [id] = event.target.getAttribute('data-item-selector')!.split(':');
    const selected = playlist.items.map((item) =>
      item.id === id ? checked : item.selected ?? false,
    );
    setSelectedItems(selected);
  };

  const getItems = (items: IPlaylistItem[] = []): JSX.Element[] => {
    return items.map((item, index) => {
      const songIndex = padZeroes(index + 1, items.length.toString().split('').length);
      const duration =
        typeof item.duration === 'string'
          ? utils.timeStringToSeconds(item.duration)
          : item.duration ?? 0;
      return (
        <ListItemWrapper key={`${item.id}:${index}`} $progress={progress?.[item.id]}>
          <ListBack data-testid="list-item-back">
            <input type="checkbox" style={{ visibility: 'hidden' }} />
            <SongIndex>{songIndex}</SongIndex>
            <span>·</span>
            <span>
              <SongName>{item.title}</SongName>
            </span>
            <Stars stars={3} />
            <SongDuration>{utils.toHumanTime(duration, true)}</SongDuration>
            <span>
              <ClearButton>
                <BsThreeDots />
              </ClearButton>
            </span>
          </ListBack>
          <ListFront $progress={progress?.[item.id]} data-testid="list-item-front">
            <input
              type="checkbox"
              id={`${item.id}:${index}`}
              data-item-selector={`${item.id}:${index}`}
              checked={item.selected}
              onChange={handleItemSelect}
            />
            <SongIndex>{songIndex}</SongIndex>
            <span>·</span>
            <span>
              <SongName>{item.title}</SongName>
            </span>
            <Stars stars={3} />
            <SongDuration>{utils.toHumanTime(duration, true)}</SongDuration>
            <span>
              <ClearButton
                onClick={async (event: React.MouseEvent<HTMLButtonElement>) => {
                  const { clientX, clientY } = event;
                  await window.commands.contextMenu('playlist-item', {
                    item,
                    x: clientX,
                    y: clientY,
                  });
                }}
              >
                <BsThreeDots />
              </ClearButton>
            </span>
          </ListFront>
        </ListItemWrapper>
      );
    });
  };

  return playlist?.items ? (
    <ListWrapper data-testid="list-wrapper">
      <ListHeader>
        <ListBack data-testid="list-header">
          <SelectAllCheckbox indeterminate={true} />
          <SpaceRight size="l" />
          <SpaceRight size="s" />
          <span>
            <SongName>Title</SongName>
          </span>
          <span style={{ textAlign: 'left' }}>Rating</span>
          <SongDuration style={{ fontFamily: 'inherit' }}>Duration</SongDuration>
          <span style={{ visibility: 'hidden' }}>
            <BsThreeDots />
          </span>
        </ListBack>
      </ListHeader>
      {getItems(sortPlaylist(playlist.items, sortOptions))}
    </ListWrapper>
  ) : null;
};

export default List;
