import { app, shell, BrowserWindow, MenuItemConstructorOptions, Menu } from 'electron';
import pjson from '@pjson';
import i18n from './utils/i18n';

interface IMenuItem extends MenuItemConstructorOptions {
  label?: string;
  submenu?: IMenuItem[];
}

export interface IMenuClickMessage {
  id: string;
}

export const applicationMenu = (
  mainWindow?: BrowserWindow,
): (MenuItemConstructorOptions | IMenuItem)[] => {
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

export const contextMenu = async (
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _type: string,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  options?: Record<string, unknown>,
  mainWindow?: BrowserWindow | null,
): Promise<void | null> => {
  const playlist: IMenuItem[] = [
    {
      label: 'Get Info',
    },
    { type: 'separator' },
    {
      label: 'Copy URL',
    },
    {
      label: 'Open in Browser',
      click: async (
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        menuItem: Electron.MenuItem,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        _browserWindow: Electron.BrowserWindow | undefined,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        _event: Electron.KeyboardEvent,
      ) => {
        console.log('menu click !', menuItem);
        options && shell.openExternal(options.url as string);
        mainWindow?.webContents.send('context-menu-click', { id: 'contextmenu.open-link' });
        return;
      },
    },
  ];
  const menu = Menu.buildFromTemplate(playlist);
  const focusedWindow = BrowserWindow.getFocusedWindow();
  const window = mainWindow === focusedWindow ? mainWindow : focusedWindow;
  return window && menu.popup({ window, ...options });
};
