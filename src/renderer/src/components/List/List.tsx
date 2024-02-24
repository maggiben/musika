import Stars from '@components/Stars/Stars';
import styled from 'styled-components';
import { padZeroes } from '@utils/string';
import type { IPlaylist } from '@renderer/states/atoms';

const SongIndex = styled.span`
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

const ListWrapper = styled.ul`
  flex-grow: 1;
  list-style: none;
  padding: 0px;
  margin: 0px;
  width: 100%;
  overflow-y: scroll;
  & > li > span {
    min-width: 0;
    &:nth-child(1) {
      text-align: right;
      font-weight: bold;
    }
    &:nth-child(2) {
      flex-basis: content;
      margin: 0px 6px;
      text-align: center;
      font-weight: bold;
      color: ${({ theme }) => theme.colors.red};
    }
    &:nth-child(3) {
      flex-basis: 65%;
      flex-grow: 1;
    }
    &:nth-child(5) {
      flex-basis: 10%;
      text-align: right;
      align-self: flex-end;
    }
  }
`;

const ListItemWrapper = styled.li`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  margin: 8px 0px;
`;

interface IListProps {
  items?: IPlaylist['items'];
}

const List = (props: IListProps): JSX.Element | null => {
  const getItem = (items: IPlaylist['items']): JSX.Element[] => {
    return items.map((song, index) => {
      const songIndex = padZeroes(index + 1, items.length.toString().split('').length);
      return (
        <ListItemWrapper key={index}>
          <SongIndex>{songIndex}</SongIndex>
          <span>·</span>
          <span>
            <SongName>{song.title}</SongName>
          </span>
          <Stars stars={3} />
          <SongDuration>{song.duration}</SongDuration>
        </ListItemWrapper>
      );
    });
  };

  return props.items ? (
    <ListWrapper data-testid="list-wrapper">{getItem(props.items)}</ListWrapper>
  ) : null;
};

export default List;
