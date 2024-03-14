import React, { useState, useRef, useCallback, useEffect } from 'react';
import styled from 'styled-components';

interface IResizablerProps extends React.HTMLAttributes<HTMLDivElement> {
  $sidebarwidth: number | string;
}

const Resizable = styled.div<IResizablerProps>`
  --sidebar-width: ${({ $sidebarwidth }) => $sidebarwidth}px;
  height: 100%;
  width: var(--sidebar-width);
  box-sizing: border-box;
  padding: ${({ theme }) => theme.spacing.s};
  position: relative;
  user-select: none;
`;

const ResizeHandler = styled.div`
  width: 1px;
  height: 100vh;
  background-color: black;
  position: absolute;
  top: 0;
  left: calc(100% - 1px);
  cursor: ew-resize;
`;

interface IResizableContainerProps {
  children: React.ReactNode;
}

const ResizableContainer = ({ children }: IResizableContainerProps): JSX.Element => {
  const sidebarRef = useRef<HTMLDivElement>(null);
  const [isResizing, setIsResizing] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(200);
  const startResizing = useCallback(() => {
    setIsResizing(true);
  }, []);

  const stopResizing = useCallback(() => {
    setIsResizing(false);
  }, []);

  const resize = useCallback(
    (mouseMoveEvent) => {
      if (isResizing) {
        const rect = sidebarRef.current?.getBoundingClientRect();
        rect && setSidebarWidth(mouseMoveEvent.clientX - rect.left);
      }
    },
    [isResizing],
  );

  useEffect(() => {
    window.addEventListener('mousemove', resize);
    window.addEventListener('mouseup', stopResizing);
    return () => {
      window.removeEventListener('mousemove', resize);
      window.removeEventListener('mouseup', stopResizing);
    };
  }, [resize, stopResizing]);

  return (
    <Resizable
      data-testid="resize-container"
      $sidebarwidth={sidebarWidth}
      ref={sidebarRef}
      onMouseDown={(e) => isResizing && e.preventDefault()}
    >
      {children}
      <ResizeHandler onMouseDown={startResizing} data-testid="resize-handler" />
    </Resizable>
  );
};

export default ResizableContainer;
