import { app, BrowserWindow, MenuItemConstructorOptions } from 'electron';
import pjson from '@pjson';
import i18n from './utils/i18n';

interface IMenuItem extends MenuItemConstructorOptions {
  label?: string;
  submenu?: IMenuItem[];
}

export interface IMenuClickMessage {
  id: string;
}

export const getMenu = (mainWindow?: BrowserWindow): (MenuItemConstructorOptions | IMenuItem)[] => {
  const template: IMenuItem[] = [
    {
      label: 'File',
      submenu: [
        {
          label: 'New',
          submenu: [
            {
              label: 'Playlist',
              accelerator: 'CmdOrCtrl+N',
              click: async () => {
                console.log('menu click !');
                mainWindow?.webContents.send('menu-click', { id: 'menu.file.new.playlist' });
                return;
              },
            },
            {
              label: 'Playlist from YouTube',
              accelerator: 'CmdOrCtrl+Shift+N',
              click: async () =>
                mainWindow?.webContents.send('menu-click', {
                  id: 'menu.file.new.playlist-from-yt',
                }),
            },
          ],
        },
        { label: 'Open File', accelerator: 'CmdOrCtrl+O' },
        { type: 'separator' },
        { label: 'Save', accelerator: 'CmdOrCtrl+S' },
        { label: 'Save As', accelerator: 'CmdOrCtrl+Shift+S' },
        { type: 'separator' },
        { label: i18n.t('menu.app.quit'), role: 'quit' },
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
        { label: 'Select All', accelerator: 'CmdOrCtrl+A', role: 'selectAll' },
      ],
    },
    {
      label: 'View',
      submenu: [
        { label: 'Reload', accelerator: 'CmdOrCtrl+R', role: 'reload' },
        { label: 'Toggle Full Screen', accelerator: 'CmdOrCtrl+F', role: 'togglefullscreen' },
        {
          label: 'Toggle Developer Tools',
          accelerator: 'CmdOrCtrl+Shift+I',
          role: 'toggleDevTools',
        },
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
            await shell.openExternal(pjson.homepage);
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
        {
          label: i18n.t('menu.app.checkForUpdates'),
          click: async () => {
            console.log('check for updates');
          },
        },
        { type: 'separator' },
        {
          label: i18n.t('menu.app.preferences'),
          accelerator: 'CmdOrCtrl+,',
          click: async () =>
            mainWindow?.webContents.send('menu-click', { id: 'menu.app.preferences' }),
        },
        { type: 'separator' },
        { role: 'services', submenu: [] },
        { type: 'separator' },
        { role: 'hide' },
        { role: 'hideOthers' },
        { role: 'unhide' },
        { type: 'separator' },
        { role: 'quit' },
      ],
    });

    // Edit menu
    template[2]?.submenu?.push(
      { type: 'separator' },
      {
        label: 'Speech',
        submenu: [{ role: 'startSpeaking' }, { role: 'stopSpeaking' }],
      },
    );

    // View menu
    if (template[3].submenu) {
      template[3].submenu[2] = {
        label: 'Toggle Developer Tools',
        accelerator: 'Cmd+Option+I',
        role: 'toggleDevTools',
      };
    }

    // Window menu
    template[4].submenu = [
      { role: 'minimize' },
      { role: 'zoom' },
      { type: 'separator' },
      { role: 'front' },
    ];
  }
  return [...template];
};
