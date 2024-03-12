import {
  app,
  nativeImage,
  clipboard,
  shell,
  BrowserWindow,
  MenuItemConstructorOptions,
  Menu,
  systemPreferences,
} from 'electron';
import sharp from 'sharp';
import pjson from '@pjson';
import React from 'react';
import * as ReactDOMServer from 'react-dom/server';
import { IconContext } from 'react-icons';
import { LuInspect } from 'react-icons/lu';
import i18n from './utils/i18n';
import { IPlaylistItem, ISortOptions } from 'types/types';

const isDev = !app.isPackaged || process.env.NODE_ENV === 'development';

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
        {
          label: 'Open Url',
          accelerator: 'CmdOrCtrl+U',
          click: async () =>
            mainWindow?.webContents.send('menu-click', { id: 'menu.file.open-url' }),
        },
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

export const converToNativeImage = async (imagePath: string): Promise<Electron.NativeImage> => {
  // Convert the SVG string to a PNG buffer
  return new Promise((resolve, reject) => {
    sharp(imagePath)
      .resize(16, 16)
      .png()
      .toBuffer()
      .then((pngBuffer) => {
        return resolve(nativeImage.createFromBuffer(pngBuffer));
      })
      .catch((error) => {
        console.error('Error converting SVG to PNG:', error);
        return reject(error);
      });
  });
};

export const contextMenu = async (
  type: string,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  options?: Record<string, unknown>,
  mainWindow?: BrowserWindow | null,
): Promise<boolean> => {
  const focusedWindow = BrowserWindow.getFocusedWindow();
  const window = mainWindow === focusedWindow ? mainWindow : focusedWindow;
  const menus = new Map<string, IMenuItem[]>();
  const playlistItem = (item: IPlaylistItem): IMenuItem[] => [
    {
      label: 'Get Info',
      id: 'contextmenu.playlist-item.get-media-info',
      click: async (menuItem: Electron.MenuItem) => {
        console.log('menu click !', menuItem);
        window?.webContents.send('context-menu-click', { id: menuItem.id, options });
      },
    },
    { type: 'separator' },
    {
      label: 'Copy URL',
      id: 'contextmenu.playlist-item.copy-link',
      click: async (menuItem: Electron.MenuItem) => {
        console.log('menu click !', menuItem);
        window?.webContents.send('context-menu-click', { id: menuItem.id, options });
        options && clipboard.writeText(item.url as string);
      },
    },
    {
      label: 'Open in Browser',
      id: 'contextmenu.playlist-item.open-link',
      click: async (
        { id }: Electron.MenuItem,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        _browserWindow: Electron.BrowserWindow | undefined,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        _event: Electron.KeyboardEvent,
      ) => {
        console.log('open browser', item.url);
        await shell.openExternal(item.url);
        window?.webContents.send('context-menu-click', { id, options });
      },
    },
  ];

  const playlistSort = (sortOptions: ISortOptions): IMenuItem[] => [
    {
      label: 'All Media',
      type: 'radio',
      checked: sortOptions.filter === 'all',
      id: 'contextmenu.playlist-sort.filter-all',
      click: async ({ id, checked, type }: Electron.MenuItem) =>
        window?.webContents.send('context-menu-click', {
          id,
          checked,
          type,
          ...options,
          sortOptions: {
            ...sortOptions,
            filter: 'all',
          },
        }),
    },
    {
      label: 'Only Favorites',
      type: 'radio',
      checked: sortOptions.filter === 'favorites',
      id: 'contextmenu.playlist-sort.filter-favorites',
      click: async ({ id, checked, type }: Electron.MenuItem) =>
        window?.webContents.send('context-menu-click', {
          id,
          checked,
          type,
          ...options,
          sortOptions: {
            ...sortOptions,
            filter: 'favorites',
          },
        }),
    },
    { type: 'separator' },
    {
      label: 'Sort Options',
      submenu: [
        {
          label: 'Title',
          type: 'radio',
          checked: sortOptions.criteria === 'title',
          id: 'contextmenu.playlist-sort.criteria-title',
          click: async ({ id, checked, type }: Electron.MenuItem) =>
            window?.webContents.send('context-menu-click', {
              id,
              checked,
              type,
              ...options,
              sortOptions: {
                ...sortOptions,
                criteria: 'title',
              },
            }),
        },
        {
          label: 'Genre',
          type: 'radio',
          checked: sortOptions.criteria === 'genere',
          id: 'contextmenu.playlist-sort.criteria-genere',
          click: async ({ id, checked, type }: Electron.MenuItem) =>
            window?.webContents.send('context-menu-click', {
              id,
              checked,
              type,
              ...options,
              sortOptions: {
                ...sortOptions,
                criteria: 'genere',
              },
            }),
        },
        {
          label: 'Author',
          type: 'radio',
          checked: sortOptions.criteria === 'author',
          id: 'contextmenu.playlist-sort.criteria-author',
          click: async ({ id, checked, type }: Electron.MenuItem) =>
            window?.webContents.send('context-menu-click', {
              id,
              checked,
              type,
              ...options,
              sortOptions: {
                ...sortOptions,
                criteria: 'author',
              },
            }),
        },
        {
          label: 'Year',
          type: 'radio',
          checked: sortOptions.criteria === 'year',
          id: 'contextmenu.playlist-sort.criteria-year',
          click: async ({ id, checked, type }: Electron.MenuItem) =>
            window?.webContents.send('context-menu-click', {
              id,
              checked,
              type,
              ...options,
              sortOptions: {
                ...sortOptions,
                criteria: 'year',
              },
            }),
        },
        {
          label: 'Time',
          type: 'radio',
          checked: sortOptions.criteria === 'time',
          id: 'contextmenu.playlist-sort.criteria-time',
          click: async ({ id, checked, type }: Electron.MenuItem) =>
            window?.webContents.send('context-menu-click', {
              id,
              checked,
              type,
              ...options,
              sortOptions: {
                ...sortOptions,
                criteria: 'time',
              },
            }),
        },
        { type: 'separator' },
        {
          label: 'Ascending',
          type: 'radio',
          checked: sortOptions.order === 'ascending',
          id: 'contextmenu.playlist-sort.ascending',
          click: async ({ id, checked, type }: Electron.MenuItem) =>
            window?.webContents.send('context-menu-click', {
              id,
              checked,
              type,
              ...options,
              sortOptions: {
                ...sortOptions,
                order: 'ascending',
              },
            }),
        },
        {
          label: 'Descending',
          type: 'radio',
          checked: sortOptions.order === 'descending',
          id: 'contextmenu.playlist-sort.descending',
          click: async ({ id, checked, type }: Electron.MenuItem) =>
            window?.webContents.send('context-menu-click', {
              id,
              checked,
              type,
              ...options,
              sortOptions: {
                ...sortOptions,
                order: 'descending',
              },
            }),
        },
      ],
    },
  ];

  options?.item && menus.set('playlist-item', playlistItem(options.item as IPlaylistItem));
  options?.sortOptions &&
    menus.set('playlist-sort', playlistSort(options.sortOptions as ISortOptions));

  let template: IMenuItem[] | undefined = menus.get(type);

  if (!template) return false;

  if (isDev) {
    // Render LuInspect component inside IconContext.Provider
    const IconElement = React.createElement(
      IconContext.Provider,
      { value: { color: systemPreferences.getColor('selected-menu-item-text') } },
      React.createElement(LuInspect),
    );

    // Render to string
    const iconBuffer = Buffer.from(ReactDOMServer.renderToString(IconElement));
    const buffer = await sharp(iconBuffer).resize(16, 16).png().toBuffer();
    template = template.concat([
      { type: 'separator' },
      {
        label: 'Inspect Element',
        icon: nativeImage.createFromBuffer(buffer),
        click: async (
          menuItem: Electron.MenuItem,
          browserWindow: Electron.BrowserWindow | undefined,
        ) => {
          console.log('menu click !', menuItem, options);
          const focusedWindow = BrowserWindow.getFocusedWindow();
          const window = browserWindow === focusedWindow ? browserWindow : focusedWindow;
          options && window?.webContents.inspectElement(options.x as number, options.y as number);
          if (window?.webContents.isDevToolsOpened()) {
            window?.webContents?.devToolsWebContents?.focus();
          }
          mainWindow?.webContents.send('context-menu-click', { id: 'contextmenu.open-link' });
          return;
        },
      },
    ]);
  }

  try {
    const menu = Menu.buildFromTemplate(template);
    window && menu.popup({ window });
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
};
