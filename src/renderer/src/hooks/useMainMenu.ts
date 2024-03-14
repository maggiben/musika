import type { IpcRendererEvent } from 'electron';
import { useEffect, DependencyList } from 'react';

const useMainMenu = <T>(
  callback: (message: T) => void,
  channels: string[] | string,
  deps?: DependencyList,
): T | undefined | void => {
  const handleContextMenuClick = async (
    _event: IpcRendererEvent,
    message: { id: string },
  ): Promise<void | boolean> => {
    return channels.includes(message.id) && callback(message as T);
  };
  useEffect(() => {
    const removeListener = window.electron.ipcRenderer.on('menu-click', handleContextMenuClick);
    return () => {
      removeListener();
    };
  }, [deps]);

  return;
};

export default useMainMenu;
