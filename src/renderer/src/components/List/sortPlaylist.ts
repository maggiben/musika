import * as utils from '@shared/lib/utils';
import { IPlaylistItem, IPlaylistSortOptions } from 'types/types';

const sortPlaylist = (
  items: IPlaylistItem[] = [],
  sortOptions?: IPlaylistSortOptions,
): IPlaylistItem[] => {
  let sorted = structuredClone(items);
  switch (sortOptions?.criteria) {
    case 'title':
      sorted = items.slice().sort((a, b) => a.title.localeCompare(b.title));
      break;
    case 'author':
      sorted = items.slice().sort((a, b) => {
        // If titles are the same, compare by author name
        if (a.author && b.author) {
          return a.author.name.localeCompare(b.author.name);
        } else if (!a.author && b.author) {
          return -1; // Put items with no author last
        } else if (a.author && !b.author) {
          return 1; // Put items with no author last
        }
        return 0; // Both items have no author, consider them equal
      });
      break;
    case 'time':
      sorted = items.slice().sort((a, b) => {
        const a_duration =
          typeof a.duration === 'string' ? utils.timeStringToSeconds(a.duration) : a.duration ?? 0;
        const b_duration =
          typeof b.duration === 'string' ? utils.timeStringToSeconds(b.duration) : b.duration ?? 0;
        if (a_duration < b_duration) {
          return -1;
        } else if (a_duration > b_duration) {
          return 1;
        }
        return 0;
      });
      break;
    default:
      return sorted;
  }

  return sortOptions?.order === 'ascending' ? sorted : sorted.reverse();
};
export default sortPlaylist;
