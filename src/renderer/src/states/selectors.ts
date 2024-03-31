import { selector, DefaultValue } from 'recoil';
import { playlistState, preferencesState } from './atoms';
import { splitIntoTuples } from '@shared/lib/utils';
import type { IPreferences, IChannel, ITrack } from 'types/types';

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
    const playlist = list?.filePath ? await window.playlist.loadPlaylist(list.filePath) : list;
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
      const getMetadata = (channelId): Promise<IChannel['metadata']> =>
        window.youtube.call('getChannel', channelId, 'metadata');
      const promiseTuples = splitIntoTuples(
        Object.keys(clone).map((key) =>
          getMetadata(key).then((metadata) => ({
            key,
            metadata,
          })),
        ),
        6,
      );
      for (const promises of promiseTuples) {
        const results = await Promise.all(promises);
        results.forEach(({ key, metadata }) => {
          clone[key]['metadata'] = metadata;
        });
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
    return getChannel(authors);
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

export const itemsFilePathsSelector = selector({
  key: 'itemsFilePathsSelector',
  get: ({ get }) => {
    const { playlist } = get(playlistState);
    return playlist
      ? playlist.items
          .map((item) => [item.id, item.filePath] as [string, string | undefined])
          .reduce((acc, [key, value]) => {
            acc[key] = value;
            return acc;
          }, {})
      : {};
  },
  set: ({ get, set }, newVal) => {
    if (newVal instanceof DefaultValue) {
      // Reset to default value if DefaultValue is provided
      set(playlistState, newVal);
      set(preferencesState, newVal);
    } else {
      const { playlist, ...state } = get(playlistState);
      if (!playlist) return;
      set(playlistState, {
        ...state,
        playlist: {
          ...playlist,
          items: playlist!.items.map((item) => ({
            ...item,
            filePath: newVal[item.id] ?? item.filePath,
          })),
        },
      });
      const preferences = get(preferencesState);
      set(preferencesState, {
        ...preferences,
        playlists: preferences.playlists.map((playlist) => ({
          ...playlist,
          items: playlist.items.map((item) => {
            return {
              ...item,
              filePath: newVal[item.id] ?? item.filePath,
            };
          }),
        })),
      });
    }
  },
});

export const sideBarSelector = selector({
  key: 'sideBarSelector',
  get: ({ get }) => {
    const preferences = get(preferencesState);
    return preferences.behaviour.sideBar.selected;
  },
  set: ({ get, set }, newVal) => {
    if (newVal instanceof DefaultValue) {
      // Reset to default value if DefaultValue is provided
      set(preferencesState, newVal);
    } else {
      const preferences = get(preferencesState);
      const newPreferences = {
        ...preferences,
        behaviour: {
          ...preferences.behaviour,
          sideBar: {
            ...preferences.behaviour.sideBar,
            selected: newVal,
          },
        },
      };
      set(preferencesState, newPreferences);
    }
  },
});

const getCircularArrayItems = <T>(list: T[], id: string): { prev: T; next: T } | undefined => {
  const index = list.findIndex((item) => item['id'] === id);
  if (index === -1) {
    return; // Item with given id not found
  }

  const length = list.length;
  const prevIndex = (index - 1 + length) % length; // Handle negative indexes
  const nextIndex = (index + 1) % length;

  return {
    prev: list[prevIndex],
    next: list[nextIndex],
  };
};

export const trackSelector = selector({
  key: 'trackSelector',
  get: async ({ get }): Promise<ITrack | undefined> => {
    const preferences = get(preferencesState);
    const {
      behaviour: { mediaPlayer: { track = undefined } = { track: undefined } },
    } = preferences;
    return track;
  },
  set: ({ get, set }, newVal) => {
    const preferences = get(preferencesState);
    if (newVal instanceof DefaultValue) {
      // Reset to default value if DefaultValue is provided
      set(preferencesState, newVal);
    } else if (newVal) {
      const { playlist } = get(playlistState);
      if (!playlist) return;
      const { prev, next } = getCircularArrayItems(playlist.items, newVal.id) ?? {
        prev: undefined,
        next: undefined,
      };
      const newPreferences = {
        ...preferences,
        behaviour: {
          ...preferences.behaviour,
          mediaPlayer: {
            ...preferences.behaviour.mediaPlayer,
            track: {
              ...newVal,
              next: next,
              prev: prev,
            },
          },
        },
      };
      set(preferencesState, newPreferences);
    }
  },
});
