import { selector } from 'recoil';
import { playlistState } from './atoms';
import type { IPreferences } from 'types/types';

// export interface RecoilState {
//   hasSelectedPerson: boolean;
//   hasMultiplePerson: boolean;
//   selectedPerson: Person[] | undefined;
// }

// export const hasSelectedPerson = selector<RecoilState['hasSelectedPerson']>({
//   key: 'hasSelectedPerson',
//   get: ({ get }) => {
//     const persons = get(atoms.personsState);
//     return persons ? Array.isArray(persons) && persons.some(({ selected }) => selected) : false;
//   },
// });

export const preferencesSelector = selector({
  key: 'preferencesSelector',
  get: async (): Promise<IPreferences> => window.preferences.loadPreferences(),
});

export const selectedItems = selector({
  key: 'selectedItems',
  get: ({ get }) => {
    const { playlist } = get(playlistState);
    return playlist ? playlist.items.map((item) => (item.selected ? true : false)) : [];
  },
});
