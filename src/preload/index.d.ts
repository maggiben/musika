import { ElectronAPI } from '@electron-toolkit/preload';
import type { IPreferences } from 'types/types';

declare global {
  interface Window {
    electron: ElectronAPI;
    commands: unknown;
    preferences: {
      loadPreferences: () => Promise<IPreferences>;
      savePreferences: () => Promise<IPreferences>;
    };
  }
}
