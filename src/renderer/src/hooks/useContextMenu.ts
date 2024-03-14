import type { IpcRendererEvent } from 'electron';
import { useEffect, DependencyList } from 'react';

const useContextMenu = <T>(
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
    const removeListener = window.electron.ipcRenderer.on(
      'context-menu-click',
      handleContextMenuClick,
    );
    return () => {
      removeListener();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deps]);

  return;
};

export default useContextMenu;
