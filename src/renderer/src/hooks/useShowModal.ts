import { useState, useEffect } from 'react';
import useCloseOnEscapeKey from './useCloseOnEscapeKey';

interface IUseShowModal {
  type?: string;
  options?: Record<string, unknown>;
}

const useShowModal = (): IUseShowModal | undefined => {
  useCloseOnEscapeKey();
  const [modal, setModal] = useState<IUseShowModal | undefined>(undefined);

  const showModalListener = (
    _event: Electron.IpcRendererEvent,
    type: string,
    options?: Record<string, unknown>,
  ): void => {
    setModal({ type, options });
  };

  useEffect(() => {
    const removeShowModalListener = window.electron.ipcRenderer.on('show-modal', showModalListener);
    return () => {
      removeShowModalListener();
    };
  }, []);

  return modal;
};

export default useShowModal;
