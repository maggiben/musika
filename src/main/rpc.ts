import {
  ipcMain,
  nativeTheme,
  IpcMainInvokeEvent,
  BrowserWindow,
  OpenDialogOptions,
} from 'electron';
import { Innertube } from 'youtubei.js';
import { contextMenu } from './menu';
import getVideoInfo from './commands/info';
import download from './commands/download';
import search from './commands/search';
import type { IPlaylist, IPreferences } from 'types/types';
import { showOpenDialog } from './utils/dialogs';
import modal from './utils/modal';
import { cloneJson } from '@shared/lib/utils';
import { savePreferences, loadPreferences } from './utils/preferences';
import { loadPlaylist, savePlaylist } from './utils/playlist';

export const setRpcHandlers = (mainWindow: BrowserWindow): void => {
  const focusedWindow = BrowserWindow.getFocusedWindow();
  const window = mainWindow === mainWindow ? mainWindow : focusedWindow;
  ipcMain.handle('dialogs', async (_event: IpcMainInvokeEvent, options: OpenDialogOptions) =>
    showOpenDialog(options),
  );

  ipcMain.handle(
    'youtube.call',
    async (
      _event: IpcMainInvokeEvent,
      command: string,
      options: unknown,
      prop: string,
      ...args: unknown[]
    ) => {
      const youtube = await Innertube.create({
        retrieve_player: false,
      });
      if (command in youtube) {
        if (typeof youtube[command] === 'function') {
          const result = await youtube[command](options);
          if (prop in result) {
            return cloneJson(result[prop]);
          } else if (typeof result[prop] === 'function') {
            return cloneJson(await result[prop](...args));
          }
        }
      }
    },
  );

  ipcMain.handle(
    'youtube.getChannel',
    async (_event: IpcMainInvokeEvent, id: string, prop: string, ...args: unknown[]) => {
      const youtube = await Innertube.create({
        retrieve_player: false,
      });
      const channel = await youtube.getChannel(id);
      if (prop in channel && typeof channel[prop] !== 'function') {
        return cloneJson(channel[prop]);
      } else if (typeof channel[prop] === 'function') {
        const result = await channel[prop](...args);
        return cloneJson(result);
      }
    },
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
