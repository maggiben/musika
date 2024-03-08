import React, { useState, useRef, useEffect, Suspense } from 'react';
import styled from 'styled-components';
import type { IPlaylistItem } from 'types/types';
import type ytdl from 'ytdl-core';
import { getNestedProperty } from '@shared/lib/utils';
import {
  FormControl,
  InputGroup,
  InputPairContainer,
  StyledLabel,
} from '@renderer/components/Form/Form';
import Loading from '@containers/loading/Loading';
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
  text-transform: capitalize;
`;

const StyledDetail = styled.dd`
  color: ${({ theme }) => theme.colors.lightGray};
`;

interface IMediaInfoContentProps {
  item: IPlaylistItem;
  videoInfo: ytdl.videoInfo;
}
const MediaInfoContent = (props: IMediaInfoContentProps): JSX.Element => {
  console.log('MediaInfoContent', props);
  const videoDetails = props.videoInfo.player_response.videoDetails;
  const moreVideoDetails = props.videoInfo.videoDetails;
  const { t } = useTranslation();

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
        ].map((property) => {
          return (
            <React.Fragment key={property}>
              <StyledTerm>{property}</StyledTerm>
              <StyledDetail>{getNestedProperty(moreVideoDetails, property) as string}</StyledDetail>
            </React.Fragment>
          );
        })}
      </dl>
    </MediaInfoBody>
  );
};
export default MediaInfoContent;
