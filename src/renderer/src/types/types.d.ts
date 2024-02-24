export interface Song {
  title: string;
  duration: string;
  stars?: number;
}

declare global {
  interface Window {
    electron: Electron;
    ipcRenderer: Electron.IpcRenderer;
  }
}