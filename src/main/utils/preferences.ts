import fs from 'node:fs/promises';
import path from 'node:path';
import {
  app,
  systemPreferences,
  ipcMain,
  IpcMainInvokeEvent,
  BrowserWindow,
  dialog,
  nativeTheme,
} from 'electron';
import { is } from '@electron-toolkit/utils';
import type { IPreferences } from 'types/types';
import EncoderStream from './EncoderStream';

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

const systemColors: TColor[] = [
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

const darwinColorsKeys = [
  'control-background', // The background of a large interface element, such as a browser or table.
  'control', // The surface of a control.
  'control-text', // The text of a control that isn’t disabled.
  'disabled-control-text', // The text of a control that’s disabled.
  'find-highlight', // The color of a find indicator.
  'grid', // The gridlines of an interface element such as a table.
  'header-text', // The text of a header cell in a table.
  'highlight', // The virtual light source onscreen.
  'keyboard-focus-indicator', // The ring that appears around the currently focused control when using the keyboard for interface navigation.
  'label', // The text of a label containing primary content.
  'link', // A link to other content.
  'placeholder-text', // A placeholder string in a control or text view.
  'quaternary-label', // The text of a label of lesser importance than a tertiary label such as watermark text.
  'scrubber-textured-background', // The background of a scrubber in the Touch Bar.
  'secondary-label', // The text of a label of lesser importance than a normal label such as a label used to represent a subheading or additional information.
  'selected-content-background', // The background for selected content in a key window or view.
  'selected-control', // The surface of a selected control.
  'selected-control-text', // The text of a selected control.
  'selected-menu-item-text', // The text of a selected menu.
  'selected-text-background', // The background of selected text.
  'selected-text', // Selected text.
  'separator', // A separator between different sections of content.
  'shadow', // The virtual shadow cast by a raised object onscreen.
  'tertiary-label', // The text of a label of lesser importance than a secondary label such as a label used to represent disabled text.
  'text-background', // Text background.
  'text', // The text in a document.
  'under-page-background', // The background behind a document's content.
  'unemphasized-selected-content-background', // The selected content in a non-key window or view.
  'unemphasized-selected-text-background', // A background for selected text in a non-key window or view.
  'unemphasized-selected-text', // Selected text in a non-key window or view.
  'window-background', // The background of a window.
  'window-frame-text', // The text in the window's titlebar area.
] as const;

/*
const windowsColorKeys = [
  '3d-dark-shadow', // Dark shadow for three-dimensional display elements.
  '3d-face', // Face color for three-dimensional display elements and for dialog box backgrounds.
  '3d-highlight', // Highlight color for three-dimensional display elements.
  '3d-light', // Light color for three-dimensional display elements.
  '3d-shadow', // Shadow color for three-dimensional display elements.
  'active-border', // Active window border.
  'active-caption', // Active window title bar. Specifies the left side color in the color gradient of an active window's title bar if the gradient effect is enabled.
  'active-caption-gradient', // Right side color in the color gradient of an active window's title bar.
  'app-workspace', // Background color of multiple document interface (MDI) applications.
  'button-text', // Text on push buttons.
  'caption-text', // Text in caption, size box, and scroll bar arrow box.
  'desktop', // Desktop background color.
  'disabled-text', // Grayed (disabled) text.
  'highlight', // Item(s) selected in a control.
  'highlight-text', // Text of item(s) selected in a control.
  'hotlight', // Color for a hyperlink or hot-tracked item.
  'inactive-border', // Inactive window border.
  'inactive-caption', // Inactive window caption. Specifies the left side color in the color gradient of an inactive window's title bar if the gradient effect is enabled.
  'inactive-caption-gradient', // Right side color in the color gradient of an inactive window's title bar.
  'inactive-caption-text', // Color of text in an inactive caption.
  'info-background', // Background color for tooltip controls.
  'info-text', // Text color for tooltip controls.
  'menu', // Menu background.
  'menu-highlight', // The color used to highlight menu items when the menu appears as a flat menu.
  'menubar', // The background color for the menu bar when menus appear as flat menus.
  'menu-text', // Text in menus.
  'scrollbar', // Scroll bar gray area.
  'window', // Window background.
  'window-frame', // Window frame.
  'window-text', // Text in windows.
] as const;
*/

// Official Blender Open Movies: https://www.youtube.com/playlist?list=PL6B3937A5D230E335
export async function getDefaultPreferences(): Promise<IPreferences> {
  const isDev = !app.isPackaged || process.env.NODE_ENV === 'development';
  const preferredSystemLanguages = app.getPreferredSystemLanguages();
  return {
    behaviour: {
      shouldUseDarkColors: nativeTheme.shouldUseDarkColors ? 'dark' : 'light',
      language: preferredSystemLanguages?.[0]?.split('-')?.[0] ?? 'en',
      preferredSystemLanguages,
      theme: {
        accentColor: `#${systemPreferences.getAccentColor()}`,
        systemColors: systemColors.reduce((acc, color) => {
          return {
            ...acc,
            [color]: systemPreferences.getSystemColor(color),
          };
        }, {}),
        colors: darwinColorsKeys.reduce((acc, color) => {
          return {
            ...acc,
            [color]: systemPreferences.getColor(color),
          };
        }, {}),
      },
      search: {
        safeSearch: false,
        limit: 100,
        type: 'playlist',
      },
      notifications: {
        enabled: true,
      },
      sideBar: {
        visible: true,
        resizable: true,
      },
    },
    downloads: {
      savePath: app.getPath('downloads'),
      maxconnections: 5,
      retries: 3,
      timeout: 120 * 1000, // 120 seconds
      quality: 'highest',
      filter: 'audioandvideo',
      fileNameTmpl: '{videoDetails.title}',
    },
    transcoding: {
      ffmpegPath: require('ffmpeg-static'),
      enabled: true,
      replace: false,
      options: {
        format: 'mp3',
        videoCodec: '',
        audioCodec: '',
        size: '',
        videoBitrate: '',
        audioFrequency: '',
        audioBitrate: '',
      },
      formats: await EncoderStream.getAvailableFormats(),
      codecs: await EncoderStream.getAvailableCodecs(),
      encoders: await EncoderStream.getAvailableEncoders(),
      filters: await EncoderStream.getAvailableFilters(),
    },
    playlists: [],
    advanced: {
      isDev,
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
}

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
export async function loadPreferences(mainWindow?: BrowserWindow | null): Promise<IPreferences> {
  const defaultPreferences = await getDefaultPreferences();
  try {
    await fs.access(preferencesPath, fs.constants.R_OK);
    const savedPreferences = JSON.parse(await fs.readFile(preferencesPath, 'utf8'));

    return {
      ...defaultPreferences,
      ...savedPreferences,
    };
  } catch (error) {
    try {
      const focusedWindow = BrowserWindow.getFocusedWindow();
      const window = mainWindow === focusedWindow ? mainWindow : focusedWindow;
      const save = await savePreferences(defaultPreferences, window);
      if (save) {
        window &&
          dialog.showMessageBox(window, {
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

export async function savePreferences(
  preferences: IPreferences,
  mainWindow?: BrowserWindow | null,
): Promise<boolean> {
  try {
    const isDirOk = await checkDirectoryExists(path.dirname(preferencesPath), true);
    if (isDirOk) {
      await fs.writeFile(preferencesPath, JSON.stringify(preferences, null, 2), 'utf8');
      return true;
    }
    return false;
  } catch (error) {
    const focusedWindow = BrowserWindow.getFocusedWindow();
    const window = mainWindow === focusedWindow ? mainWindow : focusedWindow;
    console.error(`Error creating: ${preferencesPath}`, error);
    window &&
      dialog.showMessageBox(window, {
        type: 'error',
        title: 'Error',
        defaultId: 1,
        message: `Error creating: ${preferencesPath}`,
        buttons: ['OK'],
      });
    return false;
  }
}

export async function checkDirectoryExists(
  directoryPath: string,
  create?: boolean,
): Promise<boolean> {
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
}
