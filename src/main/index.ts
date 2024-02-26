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
import getVideoInfo from './commands/info';
import download from './commands/download';
import type { IPreferences } from 'types/types';
import dialogs from './lib/dialogs';
import { savePreferences, loadPreferences } from './lib/preferences';
import creatWorker from './workers/worker-simple?nodeWorker';
// import callFork from './fork'

const template = [
  {
    label: 'File',
    submenu: [
      { label: 'New File', accelerator: 'CmdOrCtrl+N' },
      { label: 'Open File', accelerator: 'CmdOrCtrl+O' },
      { type: 'separator' },
      { label: 'Save', accelerator: 'CmdOrCtrl+S' },
      { label: 'Save As', accelerator: 'CmdOrCtrl+Shift+S' },
      { type: 'separator' },
      { label: 'Exit', role: 'quit' },
    ],
  },
  {
    label: 'Edit',
    submenu: [
      { label: 'Undo', accelerator: 'CmdOrCtrl+Z', role: 'undo' },
      { label: 'Redo', accelerator: 'CmdOrCtrl+Shift+Z', role: 'redo' },
      { type: 'separator' },
      { label: 'Cut', accelerator: 'CmdOrCtrl+X', role: 'cut' },
      { label: 'Copy', accelerator: 'CmdOrCtrl+C', role: 'copy' },
      { label: 'Paste', accelerator: 'CmdOrCtrl+V', role: 'paste' },
      { label: 'Select All', accelerator: 'CmdOrCtrl+A', role: 'selectall' },
    ],
  },
  {
    label: 'View',
    submenu: [
      { label: 'Reload', accelerator: 'CmdOrCtrl+R', role: 'reload' },
      { label: 'Toggle Full Screen', accelerator: 'CmdOrCtrl+F', role: 'togglefullscreen' },
      { label: 'Toggle Developer Tools', accelerator: 'CmdOrCtrl+Shift+I', role: 'toggledevtools' },
    ],
  },
  {
    label: 'Window',
    role: 'window',
    submenu: [
      { label: 'Minimize', accelerator: 'CmdOrCtrl+M', role: 'minimize' },
      { label: 'Close', accelerator: 'CmdOrCtrl+W', role: 'close' },
    ],
  },
  {
    label: 'Help',
    role: 'help',
    submenu: [
      {
        label: 'Learn More',
        click: async () => {
          const { shell } = require('electron');
          await shell.openExternal('https://electronjs.org');
        },
      },
    ],
  },
];

if (process.platform === 'darwin') {
  template.unshift({
    label: app.getName(),
    submenu: [
      { role: 'about' },
      { type: 'separator' },
      { role: 'services', submenu: [] },
      { type: 'separator' },
      { role: 'hide' },
      { role: 'hideothers' },
      { role: 'unhide' },
      { type: 'separator' },
      { role: 'quit' },
    ],
  });

  // Edit menu
  template[2].submenu.push(
    { type: 'separator' },
    {
      label: 'Speech',
      submenu: [{ role: 'startspeaking' }, { role: 'stopspeaking' }],
    },
  );

  // Window menu
  template[4].submenu = [
    { role: 'minimize' },
    { role: 'zoom' },
    { type: 'separator' },
    { role: 'front' },
  ];
}

function createWindow(): void {
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

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);

  mainWindow.on('ready-to-show', () => {
    mainWindow.show();
  });

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url);
    return { action: 'deny' };
  });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  ipcMain.handle('dialogs', async (event: IpcMainInvokeEvent, options: OpenDialogOptions) =>
    dialogs(options, mainWindow),
  );

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  ipcMain.handle('getVideoInfo', async (event: IpcMainInvokeEvent, url: string) => {
    const result = await getVideoInfo(url);
    return result;
  });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  ipcMain.handle('download', async (event: IpcMainInvokeEvent, url: string) => {
    const result = await download(url, mainWindow);
    return result;
  });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  ipcMain.handle('loadPreferences', async (event: IpcMainInvokeEvent) => {
    const result = await loadPreferences(mainWindow);
    return result;
  });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  ipcMain.handle(
    'savePreferences',
    async (event: IpcMainInvokeEvent, preferences: IPreferences) => {
      const result = await savePreferences(preferences, mainWindow);
      return result;
    },
  );

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
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron');

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window);
  });

  createWindow();

  creatWorker({ workerData: 'worker' })
    .on('message', (message) => {
      console.log(`\nMessage from worker: ${message}`);
    })
    .postMessage('');

  // callFork()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
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
