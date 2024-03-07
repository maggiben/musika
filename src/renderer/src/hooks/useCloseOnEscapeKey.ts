import { useEffect } from 'react';

const useCloseOnEscapeKey = (): void => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') {
        window.electron.ipcRenderer.send('close-modal', {
          sync: false,
        });
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);
};

export default useCloseOnEscapeKey;
