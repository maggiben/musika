import { ElectronAPI } from '@electron-toolkit/preload';
import type { IPreferences, IPlaylistItem } from 'types/types';
import type { OpenDialogReturnValue, OpenDialogOptions } from 'electron';

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
    commands: {
      dialogs: (options: OpenDialogOptions) => Promise<OpenDialogReturnValue>;
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
