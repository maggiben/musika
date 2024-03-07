import { ElectronAPI } from '@electron-toolkit/preload';
import type { IPreferences } from 'types/types';
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
      download: (url: string) => Promise<OpenDialogReturnValue>;
      modal: (type: string, options?: Record<string, unknown>) => Promise<boolean>;
    };
    preferences: {
      loadPreferences: () => Promise<IPreferences>;
      savePreferences: (preferences: IPreferences) => Promise<boolean>;
    };
  }
}
