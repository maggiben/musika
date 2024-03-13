import 'styled-components';
import type ytpl from '@distube/ytpl';
export type { IDownloadWorkerMessage } from '@main/utils/DownloadWorker';
export type { IMenuClickMessage } from '@main/menu';
export type { IPlaylistItem, IPlaylist } from '@states/atoms';

interface IAnimation {
  duration: string;
  timingFunction: string;
}

interface ITransition {
  duration: string;
  timingFunction: string;
}

export type TColorNames =
  | 'accentColor'
  | 'white'
  | 'black'
  | 'blue'
  | 'brown'
  | 'gray'
  | 'green'
  | 'orange'
  | 'pink'
  | 'purple'
  | 'yellow'
  | 'red'
  | 'darkGray'
  | 'softGray'
  | 'midGray'
  | 'lightGray'
  | 'violet';

export interface ISpacing {
  xxxs: string;
  xxs: string;
  xs: string;
  s: string;
  m: string;
  l: string;
  xl: string;
  xxl: string;
  xxxl: string;
}

declare module 'styled-components' {
  export interface DefaultTheme {
    colors: Record<TColorNames, string>;
    borderRadius: ISpacing;
    spacing: ISpacing;
    fontSizes: ISpacing;
    animation: IAnimation;
    transition: ITransition;
    fontFamily: {
      primary: string;
      mono: string;
    };
  }
}

type TytplItem = ytpl.result['items'][number];

export interface IPlaylistItem extends TytplItem {
  selected?: boolean;
  favorite?: boolean;
  dislike?: boolean;
}

export interface IPlaylist extends Omit<ytpl.result, 'views' | 'items'> {
  thumbnail: {
    height: number;
    width: number;
    url: string;
  };
  views: string | number;
  items: IPlaylistItem[];
}

export interface IPlaylistSortOptions {
  filter: 'all' | 'favorites';
  criteria: 'title' | 'genere' | 'year' | 'author' | 'time';
  order: 'ascending' | 'descending';
  seach?: string;
}

export interface IPlaylistProperties {
  savePath?: string;
  color: 'red' | 'violet' | 'blue' | 'yellow' | 'green';
}

export interface INotificationOptions {
  enabled: boolean;
}

export interface IPreferences {
  behaviour: {
    shouldUseDarkColors: boolean;
    language: string;
    preferredSystemLanguages?: string[];
    theme: Record<string, unknown>;
    notifications: INotificationOptions;
    search: {
      defaultSearch?: string;
      safeSearch?: boolean;
      limit?: number | Infinity;
      type?: 'video' | 'playlist';
    };
    playlists: {
      playlist?: IPlaylist;
      properties?: IPlaylistProperties;
      sortOptions?: IPlaylistSortOptions;
    }[];
  };
  advanced: {
    isDev?: boolean;
    preferencesPath?: string;
    update: {
      automatic?: boolean;
    };
    logs: {
      enabled?: boolean;
      savePath?: string;
      backup?: {
        enabled: boolean;
        maxSize: number;
      };
      purge?: {
        enabled: boolean;
        maxSize: number;
      };
    };
  };
  downloads: {
    savePath: string;
    maxconnections: number;
    retries: number;
    timeout: number;
    quality: string;
    filter?: string;
    fileNameTmpl: string;
  };
}
