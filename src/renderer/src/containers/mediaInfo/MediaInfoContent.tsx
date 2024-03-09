import React, { useState, useRef, useEffect, Suspense } from 'react';
import styled, { keyframes } from 'styled-components';
import type { IPlaylistItem } from 'types/types';
import type ytdl from 'ytdl-core';
import { getNestedProperty, replaceFromRight } from '@shared/lib/utils';
import { useTranslation } from 'react-i18next';

const MediaInfoBody = styled.div`
  display: flex;
  width: 100%;
  max-height: 100vh;
  overflow: hidden;
  overflow-y: scroll;
  justify-content: flex-start;
  flex-direction: column;
`;

const StyledTerm = styled.dt`
  color: ${({ theme }) => theme.colors.white};
  font-weight: bold;
  text-transform: capitalize;
`;

// const fadeIn = keyframes<AnimatedBoxProps>`
//   from {
//     max-height: ${({ offsetHeight }) => offsetHeight}px;
//     background-color: 'blue';
//   }
//   to {
//     max-height: ${({ scrollHeight, theme }) => {
//       console.log('keyframes', scrollHeight, theme);
//       return scrollHeight;
//     }}px;
//     display: block;
//     background-color: 'orange';
//   }
// `;

/*
const fadeIn = (
  scrollHeight: number | string,
  offsetHeight: number | string,
): ReturnType<typeof keyframes> => keyframes`
  from {
    max-height: ${offsetHeight}px;
  }
  to {
    max-height: ${scrollHeight}px;
  }
`;
*/

interface StyledDetailProps extends React.HTMLAttributes<HTMLDListElement> {
  $scrollheight: number | string;
  $offsetheight: number | string;
  $lineclamp: number | string;
}

/* animation: ${({ scrollheight, offsetheight }) => fadeIn(scrollheight, offsetheight)} 1.5s linear
  both; */
const StyledDetail = styled.dd<StyledDetailProps>`
  color: ${({ theme }) => theme.colors.lightGray};
  & .read-more-details {
    display: -webkit-box;
    -webkit-line-clamp: ${({ $lineclamp }) => $lineclamp};
    -webkit-box-orient: vertical;
    overflow: hidden;
    white-space: break-spaces;
    text-overflow: ellipsis;
  }

  & .read-more-details:is(.animating) {
  }

  & .read-more-details:not(.animating) {
  }

  & input[type='checkbox']:checked + span {
    display: block;
  }
  & input[type='checkbox']:not(:checked) + span {
  }
  & input[type='checkbox'] {
    display: none;
  }
  & input[type='checkbox'] + span > label:hover {
    color: ${({ theme }) => theme.colors.white};
    text-decoration: underline;
  }
  & input[type='checkbox']:checked ~ label:hover {
    color: ${({ theme }) => theme.colors.red};
  }
`;

const ReadMoreButton = styled.label`
  display: block;
  user-select: none;
  cursor: pointer;
  display: inline;
  font-size: inherit;
  margin-left: ${({ theme }) => theme.spacing.xs};
`;

interface IMediaInfoContentProps {
  item: IPlaylistItem;
  videoInfo: ytdl.videoInfo;
}

const truncateText = async (
  element: HTMLElement | string,
  clone: HTMLElement,
  maxHeight: number,
  lineHeight: number,
  lineClamp: number,
  index: number = 0,
  currentText: string = '',
): Promise<string> => {
  const fullText = typeof element === 'string' ? element : getFullTextContent(element);
  if (index >= fullText.length) {
    return currentText;
  }

  // const newText = fullText.slice(0, index).trim(); // element.textContent!.slice(0, index).trim();
  const beforeText = fullText.slice(0, index).trim();
  const startOfWord = Boolean(
    !fullText
      .slice(0, index - 1)
      .slice(-1)
      .trim(),
  );
  const lastWord =
    startOfWord &&
    fullText
      .slice(0, index - 1)
      .split(' ')
      .filter(Boolean)
      .pop();
  const lastWords = fullText.slice(0, index).split(' ').slice(0, -1).join(' ');
  const newText = lastWord ? lastWords : beforeText;

  clone.textContent = newText + ' ...';

  const lines = Math.ceil(clone.offsetHeight / lineHeight);

  if (
    (!!newText.slice(-1) && clone.offsetHeight < maxHeight - lineHeight) ||
    lines <= Math.ceil(maxHeight / lineHeight)
  ) {
    return await truncateText(element, clone, maxHeight, lineHeight, lineClamp, index + 1, newText);
  } else {
    clone.textContent = currentText + ' ...';
    return currentText;
  }
};

async function getTruncatedText(element: HTMLElement, lineClamp: number): Promise<string> {
  const computedSourceStyles = window.getComputedStyle(element);
  const sourceRect = element.getBoundingClientRect();
  const clone = element.cloneNode(true) as HTMLElement;
  clone.classList.add('measurment-container');
  clone.id = 'measurment-container';
  clone.style.position = 'absolute';
  clone.style.display = 'block';
  clone.style.visibility = 'visible';
  clone.style.backgroundColor = 'red';
  clone.style.zIndex = '1';
  clone.style.overflow = 'visible';
  clone.style.top = `${sourceRect.top}px`;
  clone.style.left = `${sourceRect.left}px`;
  clone.style.width = computedSourceStyles.width;
  clone.style.opacity = '0.5';
  clone.style.pointerEvents = 'none';
  clone.style.maxHeight = 'none';
  clone.style.whiteSpace = 'break-spaces';
  // clone.style.transform = 'translate(-50%, -50%)';

  document.getElementById(clone.id) &&
    document.body.removeChild(document.getElementById(clone.id) as HTMLElement);

  document.body.appendChild(clone);

  const lineHeight = parseFloat(getComputedStyle(element).lineHeight);
  const maxHeight = lineHeight * lineClamp;

  const text = await truncateText(element, clone, maxHeight, lineHeight, lineClamp);

  // document.body.removeChild(clone);
  // clone.remove();

  return text;
}

const getFullTextContent = (element: HTMLElement | ChildNode): string => {
  let text = '';

  // Add text content of current element
  if (element.nodeType === Node.TEXT_NODE) {
    text += element.textContent;
  } else {
    for (const childNode of element.childNodes) {
      text += getFullTextContent(childNode);
    }
  }

  return text;
};

const calculateCharactersToRemove = (element: HTMLElement, buttonWidth: number): number => {
  const { textContent, clientWidth } = element;
  const fontSize = window.getComputedStyle(element).fontSize;

  // Create a temporary span to measure the width of the text
  const tempSpan = document.createElement('span');
  tempSpan.style.visibility = 'hidden';
  tempSpan.style.fontSize = fontSize;
  document.body.appendChild(tempSpan);

  let width = tempSpan.offsetWidth;
  let index = textContent!.length;

  // Try removing characters one by one from the end until the button fits
  for (let i = textContent!.length - 1; i >= 0; i--) {
    tempSpan.textContent = textContent!.substring(0, i);
    width = tempSpan.offsetWidth + buttonWidth;
    if (width <= clientWidth) {
      index = i;
      break;
    }
  }

  // Remove the temporary span
  document.body.removeChild(tempSpan);

  return textContent!.length - index;
};

const MediaInfoContent = (props: IMediaInfoContentProps): JSX.Element => {
  const lineClamp = 3;
  const descriptionRefs = useRef<HTMLDListElement[]>([]);
  const readMoreButtoRefs = useRef<HTMLLabelElement[]>([]);
  // const [heights, setHeights] = useState<number[]>([]);
  const [heights, setHeights] = useState<
    { scrollHeight: number | string; offsetHeight: number | string }[]
  >([]);
  // const videoDetails = props.videoInfo.player_response.videoDetails;
  const moreVideoDetails = props.videoInfo.videoDetails;
  const { t } = useTranslation();

  const isTruncated = ({
    offsetHeight,
    scrollHeight,
    offsetWidth,
    scrollWidth,
  }: HTMLElement): boolean => offsetHeight < scrollHeight || offsetWidth < scrollWidth;

  // Function to add refs to the array
  const addRef = (element: HTMLDListElement): number | undefined => {
    if (element && !descriptionRefs.current.includes(element)) {
      return descriptionRefs.current.push(element);
    }
    return;
  };

  const addReadMoreButtonRef = (element: HTMLLabelElement): number | undefined => {
    if (element && !readMoreButtoRefs.current.includes(element)) {
      return readMoreButtoRefs.current.push(element);
    }
    return;
  };

  useEffect(() => {
    setHeights(
      descriptionRefs.current.map(({ scrollHeight, offsetHeight }) => ({
        scrollHeight,
        offsetHeight,
      })),
    );
  }, [descriptionRefs]);

  useEffect(() => {
    const descriptions = descriptionRefs.current;
    const readMoreButtons = readMoreButtoRefs.current;
    // setHeights(
    //   descriptions.map(({ scrollHeight, offsetHeight }) => ({ scrollHeight, offsetHeight })),
    // );
    descriptions.forEach(async (element, index) => {
      const isHidden = isTruncated(element as HTMLElement);
      const paragraph = element!.firstChild;
      const fullText = isHidden && (await getTruncatedText(element, lineClamp));
      index === 1 &&
        console.log(
          `isHidden: ${isHidden ? 'true' : 'false'} paragraph: ${paragraph?.textContent?.length} full: ${fullText}`,
        );
      return;
      if (element && isHidden) {
        const text =
          isHidden && element ? await getTruncatedText(element, lineClamp) : element?.textContent;
        index === 1 &&
          console.log(
            `isHidden: ${isHidden ? 'true' : 'false'} new: ${text!.length} org: ${element.textContent!.length}`,
          );
        if (text!.length <= element.textContent!.length) {
          element.textContent = text;
        }
      }
    });

    // readMoreButtons.forEach(async (element, index) => {
    //   const isHidden = isTruncated(element.parentNode as HTMLElement);
    //   if (element) {
    //     const text = element.parentNode!.textContent;
    //     console.log('useFffect truncated: ', index, isHidden, 'chars:', text?.length);
    //     if (text!.length <= element.parentNode!.textContent!.length) {
    //       element.textContent = text;
    //       console.log('readMoreButtons', readMoreButtons.length, readMoreButtons[0]);
    //       const buttonWidth = parseInt(window.getComputedStyle(readMoreButtons[0]).width, 10);
    //       console.log('buttonWidth', buttonWidth);
    //       const truncated = calculateCharactersToRemove(element, buttonWidth);
    //       console.log('MAS CHICO: ', truncated);
    //     }
    //   }
    // });

    return () => {};
  }, [descriptionRefs, readMoreButtoRefs]); // This effect runs once, after the initial render

  const handleReadMore = async (event: React.ChangeEvent<HTMLInputElement>): Promise<void> => {
    const { dataset, checked } = event.target;
    const descriptionElement = descriptionRefs.current.find(
      (ref) => ref.dataset.detailIndex === dataset.detailIndex,
    );
    const isHidden = isTruncated(descriptionElement as HTMLElement);

    if (checked) {
      const text = getNestedProperty(moreVideoDetails, dataset?.detailProperty ?? '') as string;
      console.log('long text', text);
    }

    // console.log(
    //   `checked: ${checked ? 'true' : 'false'} isHidden: ${isHidden ? 'true' : 'false'} scrollHeight: ${descriptionElement?.scrollHeight} clientHeight ${descriptionElement?.clientHeight}`,
    // );
    // const text =
    //   isHidden && descriptionElement
    //     ? await getTruncatedText(descriptionElement, lineClamp)
    //     : descriptionElement?.textContent;
    // console.log(`truncated: ${text} len: ${text?.length}`);
    // console.log('isHidden', isHidden, descriptionElement, checked, 'index', dataset.detailIndex);
  };

  return (
    <MediaInfoBody>
      <dl>
        {[
          'title',
          'description',
          'viewCount',
          'category',
          'publishDate',
          'lengthSeconds',
          'isFamilySafe',
          'author.user',
          'author.user_url',
          'author.thumbnails[0].url',
          'keywords[0]',
        ].map((property, index) => {
          const isHidden = isTruncated({
            ...heights[index],
            offsetWidth: 1,
            scrollWidth: 1,
          } as HTMLElement);
          return (
            <React.Fragment key={property}>
              <StyledTerm>{property}</StyledTerm>
              <StyledDetail
                $lineclamp={lineClamp}
                $offsetheight={heights[index]?.offsetHeight}
                $scrollheight={heights[index]?.scrollHeight}
              >
                <input
                  type="checkbox"
                  id={`${property}-read-more`}
                  data-detail-index={index}
                  onChange={handleReadMore}
                />
                <span
                  className="read-more-details"
                  data-detail-property={property}
                  data-detail-index={index}
                  ref={addRef}
                >
                  <p>{getNestedProperty(moreVideoDetails, property) as string}</p>
                  {isHidden && (
                    <ReadMoreButton ref={addReadMoreButtonRef} htmlFor={`${property}-read-more`}>
                      Read More...
                    </ReadMoreButton>
                  )}
                </span>
              </StyledDetail>
            </React.Fragment>
          );
        })}
      </dl>
    </MediaInfoBody>
  );
};
export default MediaInfoContent;
