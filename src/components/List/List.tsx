import Stars from '@components/Stars/Stars';
import styled from 'styled-components';
import type { Song } from 'types/types';
import { padZeroes } from '@utils/string';

interface IListProps {
  data?: Array<any>;
}

const songs: Song[] = [{
  "title": "Spiderwebs",
  "duration": "4:28",
  "stars": 2
}, {
  "title": "Excuse Me Mr.fasdfasdfasdfasdfasdfadsf dfasdf adfasdfasdf",
  "duration": "3:04",
  "stars": 3
}, {
  "title": "Just a Girl",
  "duration": "3:28",
  "stars": 1
}, {
  "title": "Happy Now?",
  "duration": "3:43",
  "stars": 2
}, {
  "title": "Different People",
  "duration": "4:34",
  "stars": 3
}, {
  "title": "Hey You!",
  "duration": "3:34",
  "stars": 4
}, {
  "title": "The Climb",
  "duration": "6:37",
  "stars": 5
}, {
  "title": "Sixteen",
  "duration": "3:21",
  "stars": 0
}, {
  "title": "Sunday Morning",
  "duration": "4:33",
  "stars": 0
}, {
  "title": "Don't Speak",
  "duration": "4:23"
}, {
  "title": "You Can Do It",
  "duration": "4:13",
  "stars": 4
}, {
  "title": "World Go 'Round",
  "duration": "4:09"
}, {
  "title": "End It on This",
  "duration": "3:45"
}, {
  "title": "Tragic Kingdom",
  "duration": "5:31",
  "stars": 5
}, {
  "title": "Spiderwebs",
  "duration": "4:28",
  "stars": 2
}, {
  "title": "Excuse Me Mr.fasdfasdfasdfasdfasdfadsf dfasdf adfasdfasdf",
  "duration": "3:04",
  "stars": 3
}, {
  "title": "Just a Girl",
  "duration": "3:28",
  "stars": 1
}, {
  "title": "Happy Now?",
  "duration": "3:43",
  "stars": 2
}, {
  "title": "Different People",
  "duration": "4:34",
  "stars": 3
}, {
  "title": "Hey You!",
  "duration": "3:34",
  "stars": 4
}, {
  "title": "The Climb",
  "duration": "6:37",
  "stars": 5
}, {
  "title": "Sixteen",
  "duration": "3:21",
  "stars": 0
}, {
  "title": "Sunday Morning",
  "duration": "4:33",
  "stars": 0
}, {
  "title": "Don't Speak",
  "duration": "4:23"
}, {
  "title": "You Can Do It",
  "duration": "4:13",
  "stars": 4
}, {
  "title": "World Go 'Round",
  "duration": "4:09"
}, {
  "title": "End It on This",
  "duration": "3:45"
}, {
  "title": "Tragic Kingdom",
  "duration": "5:31",
  "stars": 5
}];

const SongIndex = styled.span`
  font-family: ${({ theme }) => theme.fontFamilyMonoSpace};
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
  font-family: ${({ theme }) => theme.fontFamilyMonoSpace};
  margin-right: ${({ theme }) => theme.spacing.xxs};
`;

const ListWrapper = styled.ul`
  list-style: none;
  padding: 0px;
  margin: 0px;
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
      color: red;
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

const List = (props: IListProps) => {
  const getItem = (): JSX.Element[] => {
    return songs.map((song, index) => {
      const songIndex = padZeroes(index + 1, songs.length.toString().split('').length);
      return (
        <ListItemWrapper key={index}>
          <SongIndex>{songIndex}</SongIndex>
          <span>·</span>
          <span>
            <SongName>{song.title}</SongName>
          </span>
          <Stars stars={song.stars}/>
          <SongDuration>{song.duration}</SongDuration>
        </ListItemWrapper>
      );
    })
  };

  return (<ListWrapper data-testid="list-wrapper">{getItem()}</ListWrapper>);
};

export default List;