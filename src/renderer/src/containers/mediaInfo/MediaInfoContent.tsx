import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import type { IPlaylistItem } from 'types/types';
import type ytdl from 'ytdl-core';
import { getNestedProperty } from '@shared/lib/utils';
import { useTranslation } from 'react-i18next';

const MediaInfoBody = styled.div`
  display: flex;
  width: 100%;
  max-height: 100vh;
  overflow: hidden;
  overflow-y: scroll;
  justify-content: flex-start;
  flex-direction: column;
  box-sizing: border-box;
`;

const StyledTerm = styled.dt`
  color: ${({ theme }) => theme.colors.white};
  font-weight: bold;
  text-transform: capitalize;
`;

interface StyledDetailProps extends React.HTMLAttributes<HTMLDListElement> {
  $scrollheight: number | string;
  $offsetheight: number | string;
  $lineclamp: number | string;
}

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

  & input[type='checkbox']:checked + span {
    display: block;
  }
  & input[type='checkbox'] {
    display: none;
  }
  & input[type='checkbox'] ~ label {
    color: ${({ theme }) => theme.colors['link']};
    &:after {
      content: 'Read More...';
      display: block;
    }
    &:hover {
      color: ${({ theme }) => theme.colors.white};
      text-decoration: underline;
    }
  }
  & input[type='checkbox']:checked ~ label {
    &:after {
      content: 'Read Less...';
      display: block;
    }
  }
  & input[type='checkbox']:checked ~ label:hover {
    color: ${({ theme }) => theme.colors.red};
  }
`;

const ReadMoreButton = styled.label`
  display: inline-block;
  user-select: none;
  cursor: pointer;
  margin: 0px;
`;

interface IMediaInfoContentProps {
  item: IPlaylistItem;
  videoInfo: ytdl.videoInfo;
}

const MediaInfoContent = (props: IMediaInfoContentProps): JSX.Element => {
  const lineClamp = 3;
  const descriptionRefs = useRef<HTMLDListElement[]>([]);
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
  const addDescriptionRef = (element: HTMLDListElement): number | undefined => {
    if (element && !descriptionRefs.current.includes(element)) {
      return descriptionRefs.current.push(element);
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
  }, []);

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
                id={`${property}-detail`}
              >
                <input
                  type="checkbox"
                  id={`${property}-read-more-button`}
                  data-detail-index={index}
                  defaultChecked={false}
                />
                <span
                  className="read-more-details"
                  data-detail-property={property}
                  data-detail-index={index}
                  data-detail-is-hidden={isHidden}
                  ref={addDescriptionRef}
                >
                  {getNestedProperty(moreVideoDetails, property) as string}
                </span>
                {isHidden && (
                  <ReadMoreButton
                    data-detail-property={property}
                    data-detail-index={index}
                    htmlFor={`${property}-read-more-button`}
                  />
                )}
              </StyledDetail>
            </React.Fragment>
          );
        })}
      </dl>
    </MediaInfoBody>
  );
};
export default MediaInfoContent;
