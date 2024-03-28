import React, { useEffect, useState, useMemo } from 'react';
import ReactDOMServer from 'react-dom/server';
import { useRecoilValue } from 'recoil';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { IconContext } from 'react-icons';
import { CgPlayList } from 'react-icons/cg';
import { PiTelevisionDuotone } from 'react-icons/pi';
import { preferencesState } from '@renderer/states/atoms';
import { debounce } from '@shared/lib/utils';
import {
  GridContainer,
  GridItem,
  GridThumbnail,
  GridFigure,
  GridFigCaption,
  GridThumbnailInfo,
} from '@components/Grid/Grid';
import { SpaceRight } from '@renderer/components/Spacing/Spacing';
import type { IPlaylistItem } from 'types/types';

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

type IChannelInfo = IPlaylistItem['author'] & {
  totalItems: number;
  metadata?: Record<string, unknown>;
};
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
  const preferences = useRecoilValue(preferencesState);
  const [channels, setChannels] = useState<Record<string, IChannelInfo> | undefined>(undefined);
  const authors = preferences.playlists
    .map((playlist) => playlist.items)
    .flat()
    .slice(0, 18)
    .map((item) => item.author)
    .reduce((prev, curr) => {
      if (!prev[curr.channelID]) {
        prev[curr.channelID] = { ...curr, totalItems: 1 };
      } else {
        let { totalItems } = prev[curr.channelID];
        totalItems = totalItems + 1;
        prev[curr.channelID] = { ...curr, totalItems };
      }
      return prev;
    }, {}) as Record<string, IChannelInfo>;

  const blankCover = useMemo(() => createDefaultCover('200'), []);

  useEffect(() => {
    const getChannel = async (
      authors: Record<string, IChannelInfo>,
    ): Promise<Record<string, IChannelInfo>> => {
      const clone = structuredClone(authors);
      const get = debounce(async (channelId) => {
        return await window.youtube.call('getChannel', channelId, 'metadata');
      }, 150);

      for (const key of Object.keys(clone)) {
        clone[key]['metadata'] = (await get(key)) as Record<string, unknown>;
        setChannels(clone);
      }
      return clone;
    };
    getChannel(authors)
      .then((results) => results)
      .catch(console.error);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ChannelsContainer>
      <GridContainer data-testid="list-container">
        {channels &&
          Object.entries(channels).map(([channelId, channel]: [string, IChannelInfo]) => {
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
