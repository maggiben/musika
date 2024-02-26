import { ElectronAPI } from '@electron-toolkit/preload';
import type { IPreferences } from 'types/types';

export declare global {
  interface Window {
    electron: ElectronAPI;
    ipcRenderer: Electron.IpcRenderer;
    commands: Record<string, (...args: unknown) => Promise<unknown>>;
    preferences: {
      loadPreferences: () => Promise<IPreferences>;
      savePreferences: () => Promise<IPreferences>;
    };
  }
}
