import * as electron from 'electron';
import type { BrowserWindow, OpenDialogReturnValue, OpenDialogOptions } from 'electron';

export default async function dialog(
  options: OpenDialogOptions,
  mainWindow: BrowserWindow,
): Promise<OpenDialogReturnValue> {
  return electron.dialog.showOpenDialog(mainWindow, options);

  // {
  //   properties: ['openDirectory'],
  // }

  // .then((result) => {
  //   if (!result.canceled) {
  //     // Send selected folder path back to renderer process
  //     event.sender.send('selected-folder', result.filePaths[0]);
  //   }
  // })
}
// const result = await dialog.showOpenDialog(mainWindow, { properties: ['openDirectory'] });
// if (!result.canceled) {
//   event.sender.send('selected-folder', result.filePaths[0]);
// }
// .then((result) => {
//   if (!result.canceled) {
//     // Send selected folder path back to renderer process
//     event.sender.send('selected-folder', result.filePaths[0]);
//   }
// })
// .catch((err) => {
//   console.error('Error:', err);
// });
