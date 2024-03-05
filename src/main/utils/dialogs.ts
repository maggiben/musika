import { dialog, BrowserWindow, OpenDialogReturnValue, OpenDialogOptions } from 'electron';

export const showOpenDialog = (
  options: OpenDialogOptions,
  mainWindow?: BrowserWindow,
): Promise<OpenDialogReturnValue> | null => {
  const activeWindow = mainWindow ?? BrowserWindow.getFocusedWindow();
  console.log('dialog options:', options);
  return activeWindow && dialog.showOpenDialog(activeWindow, options);
};
