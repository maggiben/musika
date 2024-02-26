import 'styled-components';
export { IDownloadWorkerMessage } from '../main/lib/DownloadWorker';

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
  behaviour?: Record<string, unknown>;
  advanced?: Record<string, unknown>;
  downloads?: {
    savePath?: string;
    maxconnections?: number;
    retries?: number;
    timeout?: number;
  };
}
