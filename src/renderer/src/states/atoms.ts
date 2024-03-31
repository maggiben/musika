import { atom } from 'recoil';
import type {
  IPreferences,
  IPlaylist,
  IPlaylistSortOptions,
  IPlaylistProperties,
  ITrack,
} from 'types/types';
import { preferencesSelector, playlistSelector, trackSelector } from './selectors';

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
  default: playlistSelector,
});

export const preferencesState = atom<IPreferences>({
  key: 'preferencesState',
  default: preferencesSelector,
});

export const trackState = atom<ITrack | undefined>({
  key: 'trackState',
  default: trackSelector,
});
