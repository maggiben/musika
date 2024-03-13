import type { IpcRendererEvent } from 'electron';
import { useEffect, DependencyList } from 'react';

const useModal = <T>(
  callback: (type: string, message: T) => void,
  deps: DependencyList,
): T | undefined | void => {
  const handleCloseModal = async (
    _event: IpcRendererEvent,
    type: string,
    message: Record<string, unknown>,
  ): Promise<void | boolean> => {
    return deps.includes(type) && callback(type, message as T);
  };
  useEffect(() => {
    const removeCloseModalListener = window.electron.ipcRenderer.on(
      'close-modal',
      handleCloseModal,
    );
    return () => {
      removeCloseModalListener();
    };
  }, []);

  return;
};

export default useModal;
