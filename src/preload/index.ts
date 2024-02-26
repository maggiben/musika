import { ipcRenderer, contextBridge } from 'electron';
import { electronAPI } from '@electron-toolkit/preload';
import type { IPreferences } from 'types/types';

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI);
    contextBridge.exposeInMainWorld('preferences', {
      loadPreferences: () => ipcRenderer.invoke('loadPreferences', {}),
      savePreferences: (preferences: IPreferences) =>
        ipcRenderer.invoke('savePreferences', preferences),
    });
    contextBridge.exposeInMainWorld('commands', {
      getVideoInfo: (url: string) => ipcRenderer.invoke('getVideoInfo', url),
      download: (url: string) => ipcRenderer.invoke('download', url),
    });
  } catch (error) {
    console.error(error);
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI;
}
