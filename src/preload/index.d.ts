import { ElectronAPI } from '@electron-toolkit/preload';
import type { IPreferences, IPlaylistItem, IPlaylist } from 'types/types';
import type { OpenDialogReturnValue, OpenDialogOptions, MessageBoxReturnValue } from 'electron';

interface IExtendedElectronApi extends ElectronAPI {
  ipcRenderer: IpcRenderer & {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    off: (channel: string, listener: (...args: any[]) => void) => void;
  };
}

export declare global {
  interface Window {
    electron: IExtendedElectronApi;
    ipcRenderer: Electron.IpcRenderer;
    youtube: {
      call: <T>(command: string, options: unknown, prop: string, ...args: unknown[]) => Promise<T>;
      getChannel: (id: string, prop: string, ...args: unknown[]) => Promise<unknown>;
      getPlaylist: (id: string, prop: string, ...args: unknown[]) => Promise<unknown>;
    };
    library: {
      showFileInFolder: (filePath: string) => void;
      parseUri: (uri: string, check?: boolean) => string | undefined;
      checkPath: (pathOrUrl: string, mode?: number) => boolean;
    };
    commands: {
      showOpenDialog: (options: OpenDialogOptions) => Promise<OpenDialogReturnValue>;
      showMessageBox: (options: MessageBoxOptions) => Promise<MessageBoxReturnValue>;
      getVideoInfo: (url: string) => Promise<Record<string, unknown>>;
      search: (searchString: string) => Promise<Record<string, unknown>>;
      download: (source: string | IPlaylistItem[]) => Promise<Record<string, unknown>>;
      modal: (type: string, options?: Record<string, unknown>) => Promise<boolean>;
      contextMenu: (type: string, options?: Record<string, unknown>) => Promise<void | null>;
    };
    preferences: {
      loadPreferences: () => Promise<IPreferences>;
      savePreferences: (preferences: IPreferences) => Promise<boolean>;
    };
    playlist: {
      loadPlaylist: (location: string) => Promise<IPlaylist | undefined>;
      savePlaylist: (playlist: IPlaylist, location: string) => Promise<boolean>;
    };
  }
}
