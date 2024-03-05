import {
  dialog as nativeDialog,
  BrowserWindow,
  OpenDialogReturnValue,
  OpenDialogOptions,
} from 'electron';

const dialog = (
  options: OpenDialogOptions,
  mainWindow?: BrowserWindow,
): Promise<OpenDialogReturnValue> | null => {
  const activeWindow = mainWindow ?? BrowserWindow.getFocusedWindow();
  return activeWindow && nativeDialog.showOpenDialog(activeWindow, options);
};

export default dialog;
