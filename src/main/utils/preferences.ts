import {
  app,
  systemPreferences,
  ipcMain,
  IpcMainInvokeEvent,
  BrowserWindow,
  dialog,
  nativeTheme,
} from 'electron';
import * as fs from 'node:fs/promises';
import * as path from 'node:path';
import { is } from '@electron-toolkit/utils';
import type { IPreferences } from 'types/types';

const preferencesPath = path.join(app.getPath('userData'), 'config', 'preferences.json');

export type TColor =
  | 'blue'
  | 'brown'
  | 'gray'
  | 'green'
  | 'orange'
  | 'pink'
  | 'purple'
  | 'red'
  | 'yellow';
const colors: TColor[] = [
  'blue',
  'brown',
  'gray',
  'green',
  'orange',
  'pink',
  'purple',
  'red',
  'yellow',
];
const getDefaultPreferences = (): IPreferences => {
  const nodeEnv = process.env.NODE_ENV;
  const preferredSystemLanguages = app.getPreferredSystemLanguages();
  return {
    behaviour: {
      shouldUseDarkColors: nativeTheme.shouldUseDarkColors,
      language: preferredSystemLanguages?.[0]?.split('-')?.[0] ?? 'en',
      preferredSystemLanguages,
      theme: {
        accentColor: `#${systemPreferences.getAccentColor()}`,
        colors: colors.map((color) => {
          return {
            [color]: systemPreferences.getSystemColor(color),
          };
        }),
      },
      search: {
        defaultSearch:
          'https://youtube.com/watch?v=nRfDgXdInoM&list=PL_xObc8HwOwtwHHn7dZCsst07KMv6lzo9&index=2',
        safeSearch: false,
        limit: 100,
        type: 'playlist',
      },
    },
    downloads: {
      savePath: app.getPath('downloads'),
      maxconnections: 5,
      retries: 3,
      timeout: 120 * 1000, // 120 seconds,
      quality: 'lowest',
      fileNameTmpl: '{videoDetails.title}',
    },
    advanced: {
      // isDev: is.dev,
      nodeEnv,
      preferencesPath,
      update: {
        automatic: true,
      },
      logs: {
        enabled: true,
        savePath: path.join(app.getPath('userData'), 'logs'),
        backup: {
          enabled: true,
          maxSize: 1440,
        },
        purge: {
          enabled: true,
          maxSize: 2678400000,
        },
      },
    },
  };
};

export function setPreferencesModal(mainWindow: BrowserWindow): BrowserWindow {
  const modal = new BrowserWindow({
    parent: mainWindow,
    modal: true,
    show: false,
    webPreferences: {
      preload: path.join(__dirname, '../preload/index.js'),
      sandbox: false,
    },
  });
  const setEventHandlers = (modal: BrowserWindow): void => {
    modal.once('ready-to-show', () => {
      ipcMain.on('show-modal', async (_event: IpcMainInvokeEvent, options) => {
        console.log('show-modal', options);
        modal.show();
      });
      ipcMain.on('hide-modal', async (_event: IpcMainInvokeEvent, options) => {
        console.log('hide-modal', options);
        if (options?.sync) {
          mainWindow?.webContents.send('sync-preferences', options);
        }
        modal.hide();
      });
    });
  };

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    modal.loadURL(`${process.env['ELECTRON_RENDERER_URL']}/modal.html`);
    setEventHandlers(modal);
  } else {
    modal.loadFile(path.join(__dirname, '../renderer/modal.html'));
    setEventHandlers(modal);
  }
  return modal;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function loadPreferences(mainWindow?: BrowserWindow): Promise<IPreferences> {
  const defaultPreferences = getDefaultPreferences();
  try {
    await fs.access(preferencesPath, fs.constants.R_OK);
    const savedPreferences = JSON.parse(await fs.readFile(preferencesPath, 'utf8'));

    return {
      ...defaultPreferences,
      ...savedPreferences,
    };
  } catch (error) {
    try {
      const save = await savePreferences(defaultPreferences, mainWindow);
      if (save) {
        mainWindow &&
          dialog.showMessageBox(mainWindow, {
            type: 'question',
            buttons: ['Ok'],
            title: 'Default Preferences Created !',
            defaultId: 1,
            message: `We created a new preferences file for you here: ${preferencesPath}`,
            // checkboxLabel: 'Remember my answer',
            // checkboxChecked: true,
          });
        return defaultPreferences;
      }
      throw new Error(`Error creating ${preferencesPath}`);
    } catch (err) {
      console.error(`Error creating ${preferencesPath}:`, err);
    }
  }

  return defaultPreferences;
}

const checkDirectoryExists = async (directoryPath: string, create?: boolean): Promise<boolean> => {
  try {
    const stats = await fs.stat(directoryPath);
    await fs.access(path.dirname(preferencesPath), fs.constants.W_OK);
    if (stats.isDirectory()) {
      return true;
    } else if (stats.isFile()) {
      return false;
    } else if (create) {
      await fs.mkdir(directoryPath, { recursive: true });
      return true;
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    if (error.code === 'ENOENT' && create) {
      await fs.mkdir(directoryPath, { recursive: true });
      return true;
    }
    return false;
  }
  return false;
};

export async function savePreferences(
  preferences: IPreferences,
  mainWindow?: BrowserWindow,
): Promise<boolean> {
  try {
    const isDirOk = await checkDirectoryExists(path.dirname(preferencesPath), true);
    if (isDirOk) {
      await fs.writeFile(preferencesPath, JSON.stringify(preferences, null, 2), 'utf8');
      return true;
    }
    return false;
  } catch (error) {
    console.error(`Error creating: ${preferencesPath}`, error);
    mainWindow &&
      dialog.showMessageBox(mainWindow, {
        type: 'error',
        title: 'Error',
        defaultId: 1,
        message: `Error creating: ${preferencesPath}`,
        buttons: ['OK'],
      });
    return false;
  }
}
