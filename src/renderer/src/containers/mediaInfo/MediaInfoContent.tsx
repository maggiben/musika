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
          { key: 'title', label: t('title') },
          { key: 'description', label: t('description') },
          { key: 'viewCount', label: t('view count') },
          { key: 'category', label: t('category') },
          { key: 'publishDate', label: t('publish date') },
          { key: 'lengthSeconds', label: t('duration in seconds') },
          { key: 'isFamilySafe', label: t('is family safe') },
          { key: 'author.user', label: t('user') },
          { key: 'author.user_url', label: t('user url') },
          { key: 'author.thumbnails[0].url', label: t('author thumbnail') },
          { key: 'keywords[0]', label: t('keywords') },
        ].map((property, index) => {
          const isHidden = isTruncated({
            ...heights[index],
            offsetWidth: 1,
            scrollWidth: 1,
          } as HTMLElement);
          return (
            <React.Fragment key={property.key}>
              <StyledTerm>{property.label}</StyledTerm>
              <StyledDetail
                $lineclamp={lineClamp}
                $offsetheight={heights[index]?.offsetHeight}
                $scrollheight={heights[index]?.scrollHeight}
                id={`${property}-detail`}
              >
                <input
                  type="checkbox"
                  id={`${property.key}-read-more-button`}
                  data-detail-index={index}
                />
                <span
                  className="read-more-details"
                  data-detail-property={property}
                  data-detail-index={index}
                  data-detail-is-hidden={isHidden}
                  ref={addDescriptionRef}
                >
                  {getNestedProperty(moreVideoDetails, property.key) as string}
                </span>
                {isHidden && (
                  <ReadMoreButton
                    data-detail-property={property.key}
                    data-detail-index={index}
                    htmlFor={`${property.key}-read-more-button`}
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
