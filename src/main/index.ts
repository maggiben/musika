import {
  app,
  shell,
  ipcMain,
  IpcMainInvokeEvent,
  BrowserWindow,
  OpenDialogOptions,
  Menu,
} from 'electron';
import * as path from 'path';
import { electronApp, optimizer, is } from '@electron-toolkit/utils';
import { getMenu } from './menu';
import getVideoInfo from './commands/info';
import download from './commands/download';
import type { IPreferences } from 'types/types';
import dialogs from './utils/dialogs';
import { savePreferences, loadPreferences } from './utils/preferences';
import creatWorker from './workers/worker-simple?nodeWorker';
import pjson from '@pjson';
// import callFork from './fork'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function createWindow(_preferences: IPreferences): void {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux'
      ? {
          icon: path.join(__dirname, '../../build/icon.png'),
        }
      : {}),
    webPreferences: {
      preload: path.join(__dirname, '../preload/index.js'),
      sandbox: false,
    },
  });

  const modal = new BrowserWindow({
    parent: mainWindow,
    modal: true,
    show: false,
    webPreferences: {
      preload: path.join(__dirname, '../preload/index.js'),
      sandbox: false,
    },
  });

  const menu = Menu.buildFromTemplate(getMenu(mainWindow));
  Menu.setApplicationMenu(menu);

  mainWindow.on('ready-to-show', () => {
    mainWindow.show();
  });

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url);
    return { action: 'deny' };
  });

  ipcMain.handle('dialogs', async (_event: IpcMainInvokeEvent, options: OpenDialogOptions) =>
    dialogs(options, modal),
  );

  ipcMain.handle('getVideoInfo', async (_event: IpcMainInvokeEvent, url: string) =>
    getVideoInfo(url),
  );

  ipcMain.handle('download', async (_event: IpcMainInvokeEvent, url: string) =>
    download(url, mainWindow),
  );

  ipcMain.handle('loadPreferences', async () => loadPreferences(mainWindow));

  ipcMain.handle('savePreferences', async (_event: IpcMainInvokeEvent, preferences: IPreferences) =>
    savePreferences(preferences, mainWindow),
  );

  // Test active push message to Renderer-process.
  mainWindow.webContents.on('did-finish-load', () => {
    mainWindow?.webContents.send('main-process-message', new Date().toLocaleString());
  });

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL']);

    modal.loadURL(`${process.env['ELECTRON_RENDERER_URL']}/modal.html`);
    modal.once('ready-to-show', () => {
      console.log('ready-to-show-modal: ', `${process.env['ELECTRON_RENDERER_URL']}/modal.html`);
      ipcMain.on('show-modal', async () => {
        console.log('show-modal');
        modal.show();
      });
      ipcMain.on('hide-modal', async () => {
        console.log('hide-modal');
        modal.hide();
      });
    });
  } else {
    mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'));
    const modal = new BrowserWindow({
      parent: mainWindow,
      modal: true,
      show: false,
      webPreferences: {
        preload: path.join(__dirname, '../preload/index.js'),
        sandbox: false,
      },
    });
    modal.loadFile(path.join(__dirname, '../renderer/modal.html'));
    modal.once('ready-to-show', () => {
      console.log('ready-to-show-modal');
      ipcMain.handle('show-modal', async () => {
        console.log('show-modal');
        modal.show();
      });
    });
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(async () => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron');

  app.setAboutPanelOptions({
    applicationName: pjson.name,
    applicationVersion: pjson.version,
    copyright: `${pjson.author} ${new Date().getFullYear()}`,
  });

  app.setName(pjson?.name?.charAt(0).toUpperCase() + pjson?.name?.slice(1));

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window);
  });

  const preferences = await loadPreferences();

  createWindow(preferences);

  creatWorker({ workerData: 'worker' })
    .on('message', (message) => {
      console.log(`\nMessage from worker: ${message}`);
    })
    .postMessage('');

  // callFork()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow(preferences);
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.
