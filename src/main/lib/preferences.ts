import * as fs from 'node:fs/promises';
import * as path from 'path';
import { app, nativeTheme, BrowserWindow, dialog } from 'electron';
import type { IPreferences } from 'types/types';

const defaultPreferences: IPreferences = {
  behaviour: {
    shouldUseDarkColors: nativeTheme.shouldUseDarkColors,
  },
  downloads: {
    savePath: app.getPath('downloads'),
    maxconnections: 5,
    retries: 3,
    timeout: 120 * 1000, // 120 seconds
  },
  advanced: {
    preferencesPath: app.getPath('userData'),
  },
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function loadPreferences(mainWindow?: BrowserWindow): Promise<IPreferences> {
  const userDataPath = app.getPath('userData');
  const preferencesPath = path.join(userDataPath, 'preferences.json');
  try {
    await fs.access(preferencesPath, fs.constants.R_OK);
    const savedPreferences = JSON.parse(await fs.readFile(userDataPath, 'utf8'));

    return {
      ...defaultPreferences,
      advanced: {
        savedPreferences,
      },
    };
  } catch (error) {
    try {
      const save = await savePreferences(defaultPreferences, mainWindow);
      if (!save) {
        throw new Error(`Error creating ${preferencesPath}`);
      }
    } catch (err) {
      console.error(`Error creating ${preferencesPath}:`, err);
    }
  }

  return defaultPreferences;
}

export async function savePreferences(
  preferences: IPreferences,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  mainWindow?: BrowserWindow,
): Promise<boolean> {
  // const userDataPath = app.getPath('userData');
  const userDataPath = app.getPath('userData');
  console.log('------------------------------');
  console.log('------------------------------');
  console.log('userDataPath', userDataPath, '__dirname', __dirname);
  console.log('------------------------------');
  console.log('------------------------------');
  const preferencesPath = path.join(userDataPath, 'preferences.json');
  try {
    await fs.access(preferencesPath, fs.constants.W_OK);
    await fs.writeFile(preferencesPath, JSON.stringify(preferences, null, 2), 'utf8');
    console.log(`${preferencesPath} created successfully.`);
    return true;
  } catch (error) {
    console.error(`Error creating: ${preferencesPath}`, error);
    console.log('has main:', mainWindow);
    mainWindow &&
      dialog.showMessageBox(mainWindow, {
        type: 'error',
        title: 'Error',
        defaultId: 1,
        message: `Error creating: ${preferencesPath}`,
        buttons: ['OK'],
      });
  }
  return false;
}
