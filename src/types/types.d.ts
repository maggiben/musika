import 'styled-components';
import type ytpl from '@distube/ytpl';
import type ffmpeg from 'fluent-ffmpeg';
export type { ISchedulerResult, ISchedulerMessage } from '@main/utils/Scheduler';
export type { IDownloadWorkerMessage } from '@main/utils/DownloadWorker';
import type { ITranscodingOptions } from '@main/utils/EncoderStream';
export type { IMenuClickMessage } from '@main/menu';

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

type TYtplPlaylistItem = ytpl.result['items'][number];

export interface IPlaylistItem
  extends Omit<TYtplPlaylistItem, 'url_simple' | 'author' | 'duration'> {
  selected?: boolean;
  favorite?: boolean;
  dislike?: boolean;
  duration?: string | number;
  author?: {
    name: string;
  };
}

export interface IPlaylist
  extends Omit<
    ytpl.result,
    'views' | 'items' | 'visibility' | 'last_updated' | 'url' | 'description' | 'author'
  > {
  thumbnail?: {
    height?: number;
    width?: number;
    url: string;
  };
  visibility?: ytpl.result['visibility'];
  description?: ytpl.result['description'];
  url: ytpl.result['url'];
  author?: ytpl.result['author'];
  views?: string | number;
  items: IPlaylistItem[];
}

export interface IPlaylistSortOptions {
  filter: 'all' | 'favorites';
  criteria: 'title' | 'genere' | 'year' | 'author' | 'time' | 'default';
  order: 'ascending' | 'descending';
  seach?: string;
}

export interface IPlaylistProperties {
  savePath?: string;
  color: 'red' | 'violet' | 'blue' | 'yellow' | 'green';
}

export interface INotificationOptions {
  enabled: boolean;
  silent?: boolean;
}

export interface IPreferences {
  behaviour: {
    shouldUseDarkColors: boolean;
    language: string;
    preferredSystemLanguages?: string[];
    theme: Record<string, unknown>;
    notifications: INotificationOptions;
    search: {
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
  playlists: {
    id: string;
    title: string;
    description?: string | null;
    filePath: string;
    url: string;
    thumbnail?: {
      height?: number;
      width?: number;
      url: string;
    };
  }[];
  transcoding: {
    options: ITranscodingOptions;
    ffmpegPath: string;
    enabled: boolean;
    replace: boolean;
    formats: ffmpeg.Formats;
    codecs: ffmpeg.Codecs;
    encoders: ffmpeg.Encoders;
    filters: ffmpeg.Filters;
  };
  downloads: {
    savePath: string;
    maxconnections: number;
    retries: number;
    timeout: number;
    quality: string;
    filter: string;
    fileNameTmpl: string;
  };
}
