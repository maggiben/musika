import 'styled-components';

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
    fontSizes: IFontSizes;
    fontFamily: {
      primary: string;
      mono: string;
    };
  }
}
