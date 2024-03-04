import { dialog as nativeDialog } from 'electron';
import type { BrowserWindow, OpenDialogReturnValue, OpenDialogOptions } from 'electron';

const dialog = (
  options: OpenDialogOptions,
  mainWindow: BrowserWindow,
): Promise<OpenDialogReturnValue> => nativeDialog.showOpenDialog(mainWindow, options);

export default dialog;
