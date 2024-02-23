import Stars from '@components/Stars/Stars';
import styled from 'styled-components';
import type { Song } from '@types/types';
import { SpaceRight } from '@components/Spacing/Spacing';
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

const SongName = styled.p`
  text-align: left;
`;

const List = (props: IListProps) => {
  const getItem = () => {
    return songs.map((song, index) => {
      console.log('songs', songs.length)
      return (
        <li className="row" key={index}>
          <span>{padZeroes(index + 1, songs.length.toString().split('').length)}</span>
          <span>·</span>
          <span>
            <SongName>{song.title}</SongName>
          </span>
          <Stars stars={song.stars}/>
          <span className="two">{song.duration}</span><SpaceRight size="xs" />
        </li>
      );
    })
  };

  return (<ul className="container">{getItem()}</ul>);
};

export default List;