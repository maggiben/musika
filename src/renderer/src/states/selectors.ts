import { selector } from 'recoil';
import { playlistState } from './atoms';
import type { IPreferences } from 'types/types';

export const preferencesSelector = selector({
  key: 'preferencesSelector',
  get: async (): Promise<IPreferences> => window.preferences.loadPreferences(),
});

export const playlistSelector = selector({
  key: 'playlistSelector',
  get: async ({ get }) => {
    const preferences = get(preferencesSelector);
    const selected = preferences.behaviour.sideBar.selected;
    const list = preferences.playlists.find(({ id }) => id === selected);
    const playlist = list?.filePath && (await window.playlist.loadPlaylist(list.filePath));
    return {
      sortOptions: {
        filter: 'all' as const,
        order: 'ascending' as const,
        criteria: 'default' as const,
      },
      properties: undefined,
      playlist,
    };
  },
});

export const selectedItemsSelector = selector({
  key: 'selectedItems',
  get: ({ get }) => {
    const { playlist } = get(playlistState);
    return playlist ? playlist.items.map((item) => (item.selected ? true : false)) : [];
  },
  set: ({ get, set }, newVal) => {
    const { playlist, ...state } = get(playlistState);
    if (!playlist) return;
    set(playlistState, {
      ...state,
      playlist: {
        ...playlist,
        items: playlist.items.map((item, index) => ({ ...item, selected: newVal[index] })),
      },
    });
  },
});
