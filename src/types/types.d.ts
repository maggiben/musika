import 'styled-components';
export type { IDownloadWorkerMessage } from '@main/utils/DownloadWorker';
export type { IMenuClickMessage } from '@main/menu';

interface IAnimation {
  duration: string;
  timingFunction: string;
}

interface ITransition {
  duration: string;
  timingFunction: string;
}

interface IBorderRadius {
  xxxs: string;
  xxs: string;
  xs: string;
  s: string;
  m: string;
  l: string;
  xl: string;
}
interface ISpacing {
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

interface IFontSizes {
  xxxs: string;
  xxs: string;
  xs: string;
  s: string;
  m: string;
  l: string;
  xl: string;
  xxl: string;
}

// declare global {
//   interface Window {
//     electron: Electron;
//     ipcRenderer: Electron.IpcRenderer;
//     commands: Record<string, (...args: unknown) => Promise<unknown>>;
//   }
// }

declare module 'styled-components' {
  export interface DefaultTheme {
    colors: Record<string, string>;
    borderRadius: IBorderRadius;
    spacing: ISpacing;
    fontSizes: IFontSizes;
    animation: IAnimation;
    transition: ITransition;
    fontFamily: {
      primary: string;
      mono: string;
    };
  }
}

export interface IPreferences {
  behaviour?: {
    shouldUseDarkColors?: boolean;
    language?: string;
    preferredSystemLanguages?: string[];
  };
  advanced?: {
    nodeEnv?: string;
    preferencesPath?: string;
    update?: {
      automatic?: boolean;
    };
    logs?: {
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
  downloads?: {
    savePath?: string;
    maxconnections?: number;
    retries?: number;
    timeout?: number;
    quality?: string;
    filter?: string;
    fileNameTmpl?: string;
  };
}
