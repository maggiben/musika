import type { IpcRendererEvent } from 'electron';
import { useEffect, DependencyList } from 'react';

const useModal = <T>(
  callback: (type: string, message: T) => void,
  channels: string[] | string,
  deps?: DependencyList,
): T | undefined | void => {
  useEffect(() => {
    const handleCloseModal = async (
      _event: IpcRendererEvent,
      type: string,
      message: Record<string, unknown>,
    ): Promise<void | boolean> => {
      return channels.includes(type) && callback(type, message as T);
    };
    const removeCloseModalListener = window.electron.ipcRenderer.on(
      'close-modal',
      handleCloseModal,
    );
    return () => {
      removeCloseModalListener();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deps]);

  return;
};

export default useModal;
