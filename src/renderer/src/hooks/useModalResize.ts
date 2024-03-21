import { useRef, useLayoutEffect, DependencyList } from 'react';

const useModalResize = (formRef: React.RefObject<HTMLElement>, deps?: DependencyList): void => {
  const innerHeightRef = useRef<number | undefined>(undefined);

  useLayoutEffect(() => {
    if (!innerHeightRef.current && formRef.current) {
      // NavBar
      const previousElementSibling =
        formRef.current.parentElement?.previousElementSibling instanceof HTMLElement
          ? formRef.current.parentElement.previousElementSibling
          : undefined;
      // Action Buttons
      const nextElementSibling =
        formRef.current.parentElement?.nextElementSibling instanceof HTMLElement
          ? formRef.current.parentElement.nextElementSibling
          : undefined;
      const navHeight = previousElementSibling?.offsetHeight ?? 0;
      const buttonsHeight = nextElementSibling?.offsetHeight ?? 0;
      innerHeightRef.current = Math.floor(navHeight + buttonsHeight);
    }

    if (innerHeightRef.current && formRef.current) {
      const { scrollHeight } = formRef.current;
      const maxHeight = innerHeightRef.current + scrollHeight + 4; // 4px for rounding
      const height = Math.min(window.screen.height - 150, maxHeight);
      const newSize = {
        height,
        width: window.innerWidth,
      };
      window.electron.ipcRenderer.send('resize-modal', newSize);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deps]);

  return;
};

export default useModalResize;
