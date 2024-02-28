import * as electron from 'electron';
import type { BrowserWindow, OpenDialogReturnValue, OpenDialogOptions } from 'electron';

const dialog = (
  options: OpenDialogOptions,
  mainWindow: BrowserWindow,
): Promise<OpenDialogReturnValue> => electron.dialog.showOpenDialog(mainWindow, options);

export default dialog;
