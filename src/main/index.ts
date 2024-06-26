import { app, shell, BrowserWindow, Menu } from 'electron';
import * as path from 'node:path';
import { electronApp, optimizer, is } from '@electron-toolkit/utils';
import { applicationMenu } from './menu';
import { setRpcHandlers } from './rpc';
import type { IPreferences } from 'types/types';
import { loadPreferences } from './lib/preferences';
// import creatWorker from './workers/worker-simple?nodeWorker';
import pjson from '@pjson';
// import checkAndInstall from './utils/checkAndInstall';
// import callFork from './fork'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function createWindow(_preferences: IPreferences): void {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1040,
    height: 640,
    show: false,
    autoHideMenuBar: true,
    titleBarStyle: 'hidden',
    transparent: true,
    trafficLightPosition: { x: 8, y: 8 },
    ...(process.platform === 'linux'
      ? {
          icon: path.join(__dirname, '../../build/icon.png'),
        }
      : {}),
    webPreferences: {
      preload: path.join(__dirname, '../preload/index.js'),
      autoplayPolicy: 'no-user-gesture-required',
      webSecurity: process.env.ELECTRON_RENDERER_URL == null, // Cannot load local resources without that
      sandbox: false,
    },
  });

  const menu = Menu.buildFromTemplate(applicationMenu(mainWindow));
  Menu.setApplicationMenu(menu);

  if (menu.items[0].submenu) {
    // disable updates
    menu.items[0].submenu.items[1].enabled = false;
  }

  mainWindow.on('ready-to-show', () => {
    mainWindow.show();
  });

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url);
    return { action: 'deny' };
  });

  setRpcHandlers(mainWindow);

  // Test active push message to Renderer-process.
  mainWindow.webContents.on('did-finish-load', () => {
    mainWindow?.webContents.send('main-process-message', new Date().toLocaleString());
  });

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL']);
  } else {
    mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'));
  }

  // setPreferencesModal(mainWindow);
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

  // checkAndInstall();

  createWindow(preferences);

  // creatWorker({ workerData: 'worker' })
  //   .on('message', (message) => {
  //     console.log(`\nMessage from worker: ${message}`);
  //   })
  //   .postMessage('');

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
