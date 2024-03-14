import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';

const Heading = styled.h1`
  margin: 0;
  color: ${({ theme }) => theme.colors.white};
  overflow: hidden;
  width: 100%;
  height: 100%;
  white-space: break-spaces;
`;

const AutoFitHeading: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const ref = useRef<HTMLHeadingElement>(null);
  const orgFontSize = useRef<CSSStyleDeclaration>();

  const isTruncated = ({
    offsetHeight,
    scrollHeight,
    offsetWidth,
    scrollWidth,
  }: HTMLElement): boolean => offsetHeight < scrollHeight || offsetWidth < scrollWidth;

  useEffect(() => {
    if (!ref.current) return;
    if (!orgFontSize.current) orgFontSize.current = window.getComputedStyle(ref.current);
    const overflows = isTruncated(ref.current);

    const recursiveResize = (element: HTMLElement, maxSize: number): number => {
      const newSize = maxSize - 1;
      element.style.fontSize = `${newSize}px`;
      if (isTruncated(element) && maxSize > 0) {
        return recursiveResize(element, newSize);
      } else {
        return maxSize;
      }
    };

    if (overflows) {
      recursiveResize(ref.current, parseInt(orgFontSize.current.fontSize, 10));
    }
  }, [children]);

  return <Heading ref={ref}>{children}</Heading>;
};

export default AutoFitHeading;
