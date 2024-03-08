import { ipcRenderer, contextBridge } from 'electron';
import { electronAPI } from '@electron-toolkit/preload';
import type { IPreferences } from 'types/types';

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', {
      ...electronAPI,
      ipcRenderer: {
        ...electronAPI.ipcRenderer,
        // A patch for @electron-toolkit
        off: (channel, listener) => {
          console.log('calling off listener', channel);
          return ipcRenderer.off(channel, listener);
        },
      },
    });
    contextBridge.exposeInMainWorld('preferences', {
      loadPreferences: () => ipcRenderer.invoke('loadPreferences', {}),
      savePreferences: (preferences: IPreferences) =>
        ipcRenderer.invoke('savePreferences', preferences),
    });
    contextBridge.exposeInMainWorld('commands', {
      getVideoInfo: (url: string) => ipcRenderer.invoke('getVideoInfo', url),
      download: (url: string) => ipcRenderer.invoke('download', url),
      search: (searchString: string) => ipcRenderer.invoke('search', searchString),
      dialogs: (type: string) => ipcRenderer.invoke('dialogs', type),
      modal: (type: string, options?: Record<string, unknown>) =>
        ipcRenderer.invoke('modal', type, options),
      contextMenu: (type: string, options?: Record<string, unknown>) =>
        ipcRenderer.invoke('contextMenu', type, options),
    });
  } catch (error) {
    console.error(error);
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI;
}
