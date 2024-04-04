import { ipcRenderer, contextBridge, shell, OpenDialogOptions, MessageBoxOptions } from 'electron';
import { electronAPI } from '@electron-toolkit/preload';
import parseUri from '@main/utils/parseUri';
import checkPath from '@main/utils/checkPath';
import type { IPlaylist, IPreferences } from 'types/types';
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
    contextBridge.exposeInMainWorld('library', {
      showFileInFolder: (filePath: string) => shell.showItemInFolder(filePath),
      parseUri,
      checkPath,
    });
    contextBridge.exposeInMainWorld('preferences', {
      loadPreferences: () => ipcRenderer.invoke('loadPreferences', {}),
      savePreferences: (preferences: IPreferences) =>
        ipcRenderer.invoke('savePreferences', preferences),
    });
    contextBridge.exposeInMainWorld('playlist', {
      loadPlaylist: (location: string) => ipcRenderer.invoke('loadPlaylist', location),
      savePlaylist: (playlist: IPlaylist, location: string) =>
        ipcRenderer.invoke('savePlaylist', playlist, location),
    });
    contextBridge.exposeInMainWorld('youtube', {
      call: (command: string, options: unknown, prop: string, ...args: unknown[]) =>
        ipcRenderer.invoke('youtube.call', command, options, prop, ...args),
      getChannel: (id: string, prop: string, ...args: unknown[]) =>
        ipcRenderer.invoke('youtube.getChannel', id, prop, ...args),
      getPlaylist: (id: string, prop: string, ...args: unknown[]) =>
        ipcRenderer.invoke('youtube.getPlaylist', id, prop, ...args),
      search: (query: string, filters?: unknown) =>
        ipcRenderer.invoke('youtube.search', query, filters),
    });
    contextBridge.exposeInMainWorld('commands', {
      getVideoInfo: (url: string) => ipcRenderer.invoke('getVideoInfo', url),
      download: (url: string) => ipcRenderer.invoke('download', url),
      search: (searchString: string) => ipcRenderer.invoke('search', searchString),
      showOpenDialog: (options: OpenDialogOptions) => ipcRenderer.invoke('showOpenDialog', options),
      showMessageBox: (options: MessageBoxOptions) => ipcRenderer.invoke('showMessageBox', options),
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
