// import { selector } from 'recoil';
// import * as atoms from './atoms';

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

// export const hasMultiplePerson = selector<RecoilState['hasMultiplePerson']>({
//   key: 'hasMultiplePerson',
//   get: ({ get }) => {
//     const persons = get(atoms.personsState);
//     return persons ? Array.isArray(persons) && persons.length > 1 : false;
//   },
// });

// // export const selectedPerson = selector<RecoilState['selectedPerson']>({
// //   key: 'selectedPerson',
// //   get: ({ get }) => {
// //     const persons = get(atoms.personsState);
// //     const person = persons && persons.find(({ selected }) => selected);
// //     return person ? [ person ] : undefined;
// //   },
// //   set: ({ get, set }, newValue) => {
// //     const persons = get(atoms.personsState);
// //     return set(atoms.personsState, newValue);
// //   }
// // });
