import { app, dialog } from 'electron';

export const checkAndInstall = (): boolean | void => {
  const name = app.name ?? app.getName();
  const isDev = !app.isPackaged || process.env.NODE_ENV === 'development';

  if (!isDev && process.platform === 'darwin' && !app.isInApplicationsFolder()) {
    return dialog.showMessageBoxSync({
      type: 'error',
      message: 'Move to Applications folder?',
      detail: `${name} must live in the Applications folder to be able to run correctly.`,
      buttons: ['Move to Applications folder', 'No thank you', `Quit ${name}`],
      defaultId: 0,
      cancelId: 1,
    })
      ? app.moveToApplicationsFolder({
          conflictHandler: (e) => (
            'existsAndRunning' === e &&
              (dialog.showMessageBoxSync({
                type: 'error',
                message: `Another version of ${name} is currently running. Quit it, then launch this version of the app again.`,
                buttons: ['OK'],
              }),
              app.quit()),
            !0
          ),
        })
      : app.quit();
  }
};

export default checkAndInstall;
