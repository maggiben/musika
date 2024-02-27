import * as fs from 'node:fs/promises';
import * as path from 'path';
import { app, nativeTheme, BrowserWindow, dialog } from 'electron';
import type { IPreferences } from 'types/types';

const preferencesPath = path.join(app.getPath('userData'), 'config', 'preferences.json');

const getDefaultPreferences = (): IPreferences => {
  const preferredSystemLanguages = app.getPreferredSystemLanguages();
  return {
    behaviour: {
      shouldUseDarkColors: nativeTheme.shouldUseDarkColors,
      language: preferredSystemLanguages?.[0]?.split('-')?.[0] ?? 'en',
      preferredSystemLanguages,
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
      preferencesPath,
    },
  };
};

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
            buttons: ['Cancel', 'Yes, please', 'No, thanks'],
            title: 'Hello',
            defaultId: 1,
            message: `We created a new preferences file for you here: ${preferencesPath}`,
            checkboxLabel: 'Remember my answer',
            checkboxChecked: true,
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
