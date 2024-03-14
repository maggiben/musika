import React from 'react';
import Stars from '@components/Stars/Stars';
import styled, { css } from 'styled-components';
import { padZeroes } from '@utils/string';
import * as utils from '@shared/lib/utils';
import { BsThreeDots } from 'react-icons/bs';
import { ClearButton } from '@components/Form/Form';
import { SpaceRight } from '@components/Spacing/Spacing';
import { IPlaylistItem } from 'types/types';
import SelectAllCheckbox from './SelectAllCheckbox';

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

const StyledListItem = styled.li`
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

interface IListItemProps {
  item: IPlaylistItem;
  index: number;
  total: number;
  progress: number[];
  handleItemSelect: (event: React.ChangeEvent<HTMLInputElement>) => void;
}
export const ListItem = ({
  item,
  index,
  total,
  progress,
  handleItemSelect,
}: IListItemProps): JSX.Element | null => {
  const songIndex = padZeroes(index + 1, total.toString().split('').length);
  const duration =
    typeof item.duration === 'string'
      ? utils.timeStringToSeconds(item.duration)
      : item.duration ?? 0;
  return (
    <ListItemWrapper key={`${item.id}:${index}`} $progress={progress}>
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
      <ListFront $progress={progress} data-testid="list-item-front">
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
};

export const ListHeader = (): JSX.Element => {
  return (
    <StyledListItem>
      <ListBack data-testid="list-header">
        <SelectAllCheckbox />
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
    </StyledListItem>
  );
};