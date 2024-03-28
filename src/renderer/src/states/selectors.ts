import { selector } from 'recoil';
import { playlistState } from './atoms';
import { debounce } from '@shared/lib/utils';
import type { IPreferences, IChannel } from 'types/types';

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

export const channelSelector = selector({
  key: 'channelSelector',
  get: async ({ get }) => {
    const preferences = get(preferencesSelector);
    const getChannel = async (
      authors: Record<string, IChannel>,
    ): Promise<Record<string, IChannel>> => {
      const clone = structuredClone(authors);
      const get = debounce(async (channelId) => {
        return await window.youtube.call('getChannel', channelId, 'metadata');
      }, 50);

      for (const key of Object.keys(clone)) {
        clone[key]['metadata'] = (await get(key)) as IChannel['metadata'];
      }
      return clone;
    };
    const authors = preferences.playlists
      .map((playlist) => playlist.items)
      .flat()
      .map((item) => item.author)
      .reduce((prev, curr) => {
        if (!prev[curr.channelID]) {
          prev[curr.channelID] = { ...curr, totalItems: 1 };
        } else {
          let { totalItems } = prev[curr.channelID];
          totalItems = totalItems + 1;
          prev[curr.channelID] = { ...curr, totalItems };
        }
        return prev;
      }, {});

    return await getChannel(authors);
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
