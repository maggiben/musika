import {
  ipcMain,
  nativeTheme,
  IpcMainInvokeEvent,
  BrowserWindow,
  OpenDialogOptions,
} from 'electron';
import { contextMenu } from './menu';
import getVideoInfo from './commands/info';
import download from './commands/download';
import search from './commands/search';
import type { IPlaylist, IPreferences } from 'types/types';
import { showOpenDialog } from './utils/dialogs';
import modal from './utils/modal';
import { savePreferences, loadPreferences } from './utils/preferences';
import { loadPlaylist, savePlaylist } from './utils/playlist';

export const setRpcHandlers = (mainWindow: BrowserWindow): void => {
  const focusedWindow = BrowserWindow.getFocusedWindow();
  const window = mainWindow === mainWindow ? mainWindow : focusedWindow;
  ipcMain.handle('dialogs', async (_event: IpcMainInvokeEvent, options: OpenDialogOptions) =>
    showOpenDialog(options),
  );

  ipcMain.handle('getVideoInfo', async (_event: IpcMainInvokeEvent, url: string) =>
    getVideoInfo(url),
  );

  ipcMain.handle('search', async (_event: IpcMainInvokeEvent, searchString: string) =>
    search(searchString),
  );

  ipcMain.handle(
    'modal',
    async (_event: IpcMainInvokeEvent, type: string, options?: Record<string, unknown>) =>
      modal(type, options, window),
  );

  ipcMain.handle(
    'contextMenu',
    async (_event: IpcMainInvokeEvent, type: string, options?: Record<string, unknown>) =>
      contextMenu(type, options, window),
  );

  ipcMain.handle('download', async (_event: IpcMainInvokeEvent, url: string) =>
    download(url, window),
  );

  ipcMain.handle('loadPreferences', async () => loadPreferences(window));

  ipcMain.handle('savePreferences', async (_event: IpcMainInvokeEvent, preferences: IPreferences) =>
    savePreferences(preferences, window),
  );

  ipcMain.handle('loadPlaylist', async (_event: IpcMainInvokeEvent, location: string) =>
    loadPlaylist(location),
  );

  ipcMain.handle(
    'savePlaylist',
    async (_event: IpcMainInvokeEvent, playlist: IPlaylist, location: string) =>
      savePlaylist(playlist, location),
  );

  ipcMain.handle('dark-mode:toggle', () => {
    if (nativeTheme.shouldUseDarkColors) {
      nativeTheme.themeSource = 'light';
    } else {
      nativeTheme.themeSource = 'dark';
    }
    return nativeTheme.shouldUseDarkColors;
  });

  ipcMain.handle('dark-mode:system', () => {
    nativeTheme.themeSource = 'system';
  });
};
