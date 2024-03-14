import { atom } from 'recoil';
import type {
  IPreferences,
  IPlaylist,
  IPlaylistSortOptions,
  IPlaylistProperties,
} from 'types/types';
import { preferencesSelector } from './selectors';

/*
gta: https://www.youtube.com/watch?v=Lfgf9HatIHI&list=PLJV9FvSQV-k5MsXAYXZiRlR2nGzO9_kAD
pulp: https://www.youtube.com/watch?v=DZXlZXS9uLU&list=PL91AE989DF30F66AC
*/

export const playlistState = atom<{
  playlist?: IPlaylist;
  sortOptions?: IPlaylistSortOptions;
  properties?: IPlaylistProperties;
}>({
  key: 'playlistState',
  default: {
    sortOptions: {
      filter: 'all',
      order: 'ascending',
      criteria: 'default',
    },
    properties: undefined,
    playlist: undefined,
  },
});

export const preferencesState = atom<IPreferences>({
  key: 'preferencesState',
  default: preferencesSelector,
});
