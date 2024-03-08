import React, { useEffect, useRef } from 'react';
import Stars from '@components/Stars/Stars';
import styled, { css } from 'styled-components';
import { padZeroes } from '@utils/string';
import * as utils from '@shared/lib/utils';
import { useRecoilState } from 'recoil';
import { BsThreeDots } from '@react-icons/all-files/bs/BsThreeDots';
import useDownload from '@hooks/useDownload';
// import useFakeProgress from '@hooks/useFakeProgress';
import { ClearButton } from '@components/Form/Form';
import { SpaceRight } from '@components/Spacing/Spacing';
import { playlistState, IPlaylist } from '@renderer/states/atoms';

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
    &:nth-child(1) {
      text-align: right;
      font-weight: bold;
    }
    &:nth-child(3) {
      flex-basis: content;
      margin: 0px 6px;
      text-align: center;
      font-weight: bold;
    }
    &:nth-child(4) {
      flex-basis: 65%;
      flex-grow: 1;
    }
    &:nth-child(5) {
      flex-basis: 10%;
      text-align: right;
      align-self: flex-end;
    }
    &:nth-child(6) {
      flex-basis: 12%;
      text-align: right;
      align-self: flex-end;
    }
    &:nth-child(7) {
      flex-basis: 5%;
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

const ListItemWrapper = styled.li<{
  $progress?: number[];
}>`
  position: relative;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  &::before {
    content: '';
    position: absolute;
    height: 100%;
    background: ${({ theme }) => theme.colors.red};
    z-index: -1;
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
    background-color: ${({ theme }) => theme.colors['window-background']};
    z-index: 1;
  }
`;

interface SelectAllCheckboxProps {
  indeterminate?: boolean;
}

const SelectAllCheckbox: React.FC<SelectAllCheckboxProps> = ({ indeterminate }) => {
  const checkboxRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (checkboxRef.current) {
      checkboxRef.current.indeterminate = indeterminate ?? false;
    }
  }, [indeterminate]);

  return <input type="checkbox" ref={checkboxRef} />;
};

interface IListProps {
  items?: IPlaylist['items'];
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const List = (_props: IListProps): JSX.Element | null => {
  const [{ playlist }, setPlaylist] = useRecoilState(playlistState);
  const progress = useDownload();

  const handleItemSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { checked } = event.target;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [_itemId, index] = event.target.getAttribute('data-item-selector')!.split(':');
    // Create a new array with the modified item
    setPlaylist((prev) => {
      if (!prev || !prev.playlist) {
        return prev;
      }
      const items: IPlaylist['items'] = [
        ...prev.playlist.items.slice(0, parseInt(index, 10)), // Copy items before the modified item
        { ...prev.playlist.items[parseInt(index, 10)], selected: checked }, // Copy the modified item with the new name
        ...prev.playlist.items.slice(parseInt(index, 10) + 1), // Copy items after the modified item
      ];
      return {
        ...prev,
        playlist: {
          ...prev.playlist,
          items,
        },
      };
    });
  };

  const getItems = (items: IPlaylist['items'] = []): JSX.Element[] => {
    const maxHours = Math.max(
      ...items.map(({ duration }) => Math.floor(utils.timeStringToSeconds(duration ?? '0') / 3600)),
    );

    return items.map((item, index) => {
      const songIndex = padZeroes(index + 1, items.length.toString().split('').length);
      return (
        <ListItemWrapper key={`${item.id}:${index}`} $progress={progress?.[item.id]}>
          <ListBack data-testid="list-item-back">
            <input type="checkbox" style={{ display: 'hidden' }} />
            <SongIndex>{songIndex}</SongIndex>
            <span>·</span>
            <span>
              <SongName>{item.title}</SongName>
            </span>
            <Stars stars={3} />
            <SongDuration>
              {utils.toHumanTime(utils.timeStringToSeconds(item.duration ?? '0'), true, maxHours)}
            </SongDuration>
            <span>
              <ClearButton>
                <BsThreeDots />
              </ClearButton>
            </span>
          </ListBack>
          <ListFront $progress={progress?.[item.id]} data-testid="list-item-front">
            <input
              type="checkbox"
              defaultChecked={item.selected}
              data-item-selector={`${item.id}:${index}`}
              onChange={handleItemSelect}
            />
            <SongIndex>{songIndex}</SongIndex>
            <span>·</span>
            <span>
              <SongName>{item.title}</SongName>
            </span>
            <Stars stars={3} />
            <SongDuration>
              {utils.toHumanTime(utils.timeStringToSeconds(item.duration ?? '0'), true, maxHours)}
            </SongDuration>
            <span>
              <ClearButton
                onClick={async (event: React.MouseEvent<HTMLButtonElement>) => {
                  const { clientX, clientY } = event;
                  await window.commands.contextMenu('playlist-item', {
                    ...item,
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
          <span>
            <BsThreeDots />
          </span>
        </ListBack>
      </ListHeader>
      {getItems(playlist.items)}
    </ListWrapper>
  ) : null;
};

export default List;
