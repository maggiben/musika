import React, { useMemo } from 'react';
import ReactDOMServer from 'react-dom/server';
import { useRecoilValue } from 'recoil';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { IconContext } from 'react-icons';
import { CgPlayList } from 'react-icons/cg';
import { PiTelevisionDuotone } from 'react-icons/pi';
import { channelSelector } from '@states/selectors';
import {
  GridContainer,
  GridItem,
  GridThumbnail,
  GridFigure,
  GridFigCaption,
  GridThumbnailInfo,
} from '@components/Grid/Grid';
import { SpaceRight } from '@renderer/components/Spacing/Spacing';
import type { IChannel } from 'types/types';

const ChannelsContainer = styled.div`
  --thumbnail-size: 200px;
  max-height: 100vh;
  width: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  padding: ${({ theme }) => theme.spacing.s};
`;

const createDefaultCover = (size: string = '512'): string | undefined => {
  const IconElement = React.createElement(
    IconContext.Provider,
    {
      value: {
        color: '#000000',
        size,
        style: {
          backgroundColor: 'gray',
        },
      },
    },
    React.createElement(PiTelevisionDuotone),
  );
  const svgBlob = new Blob([ReactDOMServer.renderToString(IconElement)], {
    type: 'image/svg+xml;charset=utf-8',
  });
  return URL.createObjectURL(svgBlob);
};

const AllPlaylists = (): JSX.Element => {
  const { t } = useTranslation();
  const channels = useRecoilValue(channelSelector);
  const blankCover = useMemo(() => createDefaultCover('200'), []);

  return (
    <ChannelsContainer>
      <GridContainer data-testid="list-container">
        {channels &&
          Object.entries(channels).map(([channelId, channel]: [string, IChannel]) => {
            const avatar = channel?.metadata?.['thumbnail']?.[0]?.['url'] ?? blankCover;
            return (
              <GridItem key={channelId} onClick={() => {}}>
                <GridFigure>
                  <GridThumbnail>
                    <img loading="lazy" src={avatar} />
                    <GridThumbnailInfo>
                      <CgPlayList />
                      <SpaceRight size="xxs" />
                      {t('video count', {
                        count: channel.totalItems,
                        total: channel.totalItems,
                      })}
                    </GridThumbnailInfo>
                  </GridThumbnail>
                  <GridFigCaption>
                    <span>{channel.name}</span>
                  </GridFigCaption>
                </GridFigure>
              </GridItem>
            );
          })}
      </GridContainer>
    </ChannelsContainer>
  );
};

export default AllPlaylists;
