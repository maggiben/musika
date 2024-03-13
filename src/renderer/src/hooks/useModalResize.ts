import { useRef, useLayoutEffect } from 'react';

const getSize = (element: HTMLElement): [number, number] => {
  return [element.offsetWidth, element.offsetHeight];
};

const useModalResize = (formRef: React.RefObject<HTMLElement>): void => {
  const innerHeightRef = useRef<number | undefined>(undefined);

  useLayoutEffect(() => {
    if (!innerHeightRef.current && formRef.current) {
      const previousElementSibling =
        formRef.current.parentElement?.previousElementSibling instanceof HTMLElement
          ? formRef.current.parentElement.previousElementSibling
          : undefined;
      const nextElementSibling =
        formRef.current.parentElement?.nextElementSibling instanceof HTMLElement
          ? formRef.current.parentElement.nextElementSibling
          : undefined;

      const [, navHeight] = previousElementSibling ? getSize(previousElementSibling) : [0, 0];
      const [, buttonsHeight] = nextElementSibling ? getSize(nextElementSibling) : [0, 0];

      innerHeightRef.current = navHeight + buttonsHeight;
    }

    if (innerHeightRef.current && formRef.current) {
      const { scrollHeight } = formRef.current;
      const maxHeight = innerHeightRef.current + scrollHeight;
      const height =
        window.screen.height - 150 > maxHeight ? maxHeight : window.screen.height - 150;
      const newSize = {
        height,
        width: window.innerWidth,
      };

      window.electron.ipcRenderer.send('resize-modal', newSize);
    }
  }, [formRef]);

  return;
};

export default useModalResize;
