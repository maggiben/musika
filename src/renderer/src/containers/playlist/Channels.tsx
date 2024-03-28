import { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { CgPlayList } from 'react-icons/cg';
import { preferencesState } from '@renderer/states/atoms';
import { debounce } from '@shared/lib/utils';
import { SpaceRight } from '@renderer/components/Spacing/Spacing';
import type { IPlaylistItem } from 'types/types';

const ChannelsContainer = styled.div`
  max-height: 100vh;
  width: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  padding: ${({ theme }) => theme.spacing.s};
`;

const GridContainer = styled.ul`
  box-sizing: border-box;
  list-style: none;
  padding: 0px;
  max-width: 100%;
  margin: 0px;
  overflow-y: scroll;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  grid-gap: ${({ theme }) => theme.spacing.s};
`;

const GridItem = styled.li`
  box-sizing: border-box;
  padding: ${({ theme }) => theme.spacing.xxs};
  border-radius: ${({ theme }) => theme.borderRadius.xs};
  color: ${({ theme }) => theme.colors.lightGray};
  margin: 0px;
  cursor: pointer;
  &:hover {
    background-color: ${({ theme }) => theme.colors.softGray};
    color: white;
  }
`;

const GridThumbnail = styled.div`
  position: relative;
  & > img {
    border-radius: ${({ theme }) => theme.borderRadius.xs};
  }
`;

const GridFigure = styled.figure`
  padding: 0px;
  margin: 0px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-direction: column;
  line-height: 1em;
  & ${GridThumbnail} > img {
    max-width: 100%;
  }
`;

const GridFigCaption = styled.figcaption`
  padding: 0px;
  margin: 0px;
  max-width: 100%;
  display: flex;
  flex-direction: row;
  margin-top: ${({ theme }) => theme.spacing.xs};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const GridThumbnailInfo = styled.span`
  position: absolute;
  white-space: nowrap;
  border-radius: ${({ theme }) => theme.borderRadius.xxs};
  background-color: rgba(0, 0, 0, 0.75);
  right: calc(0px + ${({ theme }) => theme.spacing.xs});
  bottom: calc(0px + ${({ theme }) => theme.spacing.xs});
  display: flex;
  justify-content: center;
  align-items: center;
  color: ${({ theme }) => theme.colors.white};
  padding: ${({ theme }) => theme.spacing.xxs};
`;

type IChannelInfo = IPlaylistItem['author'] & {
  totalItems: number;
  metadata?: Record<string, unknown>;
};

const AllPlaylists = (): JSX.Element => {
  const { t } = useTranslation();
  const preferences = useRecoilValue(preferencesState);
  const authors = preferences.playlists
    .map((playlist) => playlist.items)
    .flat()
    .slice(0, 8)
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
  const [channels, setChannels] = useState<Record<string, IChannelInfo> | undefined>(undefined);

  useEffect(() => {
    const getChannel = async (
      authors: Record<string, IChannelInfo>,
    ): Promise<Record<string, IChannelInfo>> => {
      const clone = structuredClone(authors);
      const get = debounce(async (channelId) => {
        return await window.youtube.call('getChannel', channelId, 'metadata');
      }, 50);

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
            return (
              <GridItem key={channelId} onClick={() => {}}>
                <GridFigure>
                  <GridThumbnail>
                    <img src={channel?.metadata?.['avatar']?.[0]?.['url'] as string} />
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
