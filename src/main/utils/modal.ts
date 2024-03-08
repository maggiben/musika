import { app, powerMonitor, ipcMain, IpcMainInvokeEvent, BrowserWindow } from 'electron';
import * as path from 'node:path';

const isDev = !app.isPackaged || process.env.NODE_ENV === 'development';

export interface IModalOptions {}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default async function modal(
  type: string,
  options?: Record<string, unknown>,
  mainWindow?: BrowserWindow,
): Promise<boolean> {
  console.log('new modal', type, options, mainWindow);
  const modal = new BrowserWindow({
    parent: mainWindow ? mainWindow : BrowserWindow.getFocusedWindow() ?? undefined,
    modal: true,
    show: false,
    ...options,
    webPreferences: {
      preload: path.join(__dirname, '../preload/index.js'),
      sandbox: false,
    },
  });
  const setEventHandlers = (modal: BrowserWindow): void => {
    modal.once('ready-to-show', () => {
      const resumeEventHander = (): void => {
        console.log('Computer resume');
        modal?.webContents.send('show-modal', type, options);
      };
      powerMonitor.on('resume', resumeEventHander);
      console.log('show-modal', type, options);
      modal?.webContents.send('show-modal', type, options);
      modal.show();
      ipcMain.once('close-modal', async (_event: IpcMainInvokeEvent, options) => {
        console.log('close-modal', options);
        mainWindow?.webContents.send('close-modal', options);
        powerMonitor.off('resume', resumeEventHander);
        modal.hide();
        modal.destroy();
        modal = undefined as unknown as BrowserWindow;
      });
    });
  };

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (isDev && process.env['ELECTRON_RENDERER_URL']) {
    modal.loadURL(`${process.env['ELECTRON_RENDERER_URL']}/modal.html`);
    setEventHandlers(modal);
  } else {
    modal.loadFile(path.join(__dirname, '../renderer/modal.html'));
    setEventHandlers(modal);
  }
  return !!modal;
}
