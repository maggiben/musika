import 'styled-components';

// export interface IDefaultTheme {
//   colors: Record<string, string>;
//   borderRadius: IBorderRadius;
//   spacing: ISpacing;
// }

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

export interface Song {
  title: string;
  duration: string;
  stars?: number;
}

declare global {
  interface Window {
    electron: Electron;
    ipcRenderer: Electron.IpcRenderer;
    commands: Record<string, (...args: unknown) => Promise<unknown>>;
  }
}
declare module 'styled-components' {
  export interface DefaultTheme {
    colors: Record<string, string>;
    borderRadius: IBorderRadius;
    spacing: ISpacing;
  }
}
