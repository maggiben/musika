import type { IpcRendererEvent } from 'electron';
import { useEffect, DependencyList } from 'react';

const useMainMenu = <T>(
  callback: (message: T) => void,
  deps: DependencyList,
): T | undefined | void => {
  const handleContextMenuClick = async (
    _event: IpcRendererEvent,
    message: { id: string },
  ): Promise<void | boolean> => {
    return deps.includes(message.id) && callback(message as T);
  };
  useEffect(() => {
    const removeListener = window.electron.ipcRenderer.on('menu-click', handleContextMenuClick);
    return () => {
      removeListener();
    };
  }, []);

  return;
};

export default useMainMenu;
