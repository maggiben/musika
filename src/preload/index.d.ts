import { ElectronAPI } from '@electron-toolkit/preload';
import type { IPreferences } from 'types/types';
import type { OpenDialogReturnValue, OpenDialogOptions } from 'electron';

export declare global {
  interface Window {
    electron: ElectronAPI;
    ipcRenderer: Electron.IpcRenderer;
    commands: {
      dialogs: (options: OpenDialogOptions) => Promise<OpenDialogReturnValue>;
      getVideoInfo: (url: string) => Promise<Record<string, unknown>>;
      download: (url: string) => Promise<OpenDialogReturnValue>;
    };
    preferences: {
      loadPreferences: () => Promise<IPreferences>;
      savePreferences: (preferences: IPreferences) => Promise<boolean>;
    };
  }
}
