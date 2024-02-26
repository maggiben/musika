import { selector } from 'recoil';
import * as atoms from './atoms';
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

const defaultPreferences: IPreferences = {
  behaviour: {},
  downloads: {
    savePath: '',
  },
  advanced: {},
};

export const preferencesSelector = selector({
  key: 'preferencesSelector',
  get: async (): Promise<IPreferences> => {
    try {
      return await window.preferences.loadPreferences();
    } catch (error) {
      console.error(error);
      return defaultPreferences;
    }
  },
});
