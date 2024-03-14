import React, { Suspense } from 'react';
import styled from 'styled-components';
import type ytdl from 'ytdl-core';
import { useTranslation } from 'react-i18next';
import type { IPlaylistItem } from 'types/types';
import { DarwinButton } from '@renderer/components/Form/Form';
import Loading from '@containers/loading/Loading';
import { SpaceRight } from '@components/Spacing/Spacing';
import AutoFitHeading from '@components/AutoFitHeading/AutoFitHeading';

const MediaInfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  box-sizing: border-box;
  height: 100%;
  & > * {
    padding: ${({ theme }) => theme.spacing.s};
  }
  & > *:nth-child(2) {
    background-color: ${({ theme }) => theme.colors.darkGray};
  }
`;

const ButtonsContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  width: 100%;
  border-top: 1px solid ${({ theme }) => theme.colors['separator']};
  box-sizing: border-box;
`;

const HeaderContainer = styled.div`
  --thumbnail-height: 120px;
  width: 100%;
  min-height: 140px;
  max-height: 140px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;
  overflow: hidden;
  border-bottom: 1px solid ${({ theme }) => theme.colors['separator']};
  box-sizing: border-box;
`;

const HeaderTitle = styled.h1`
  margin: 0;
  color: ${({ theme }) => theme.colors.white};
  overflow: hidden;
  width: 100%;
  height: 100%;
  white-space: break-spaces;
`;

const StyledImg = styled.img`
  width: auto;
  max-height: var(--thumbnail-height);
  border-radius: ${({ theme }) => theme.spacing.xs};
  -webkit-box-reflect: below 1px
    linear-gradient(
      to bottom,
      rgba(0, 0, 0, 0) 0%,
      rgba(0, 0, 0, 0) calc(var(--thumbnail-height) - ${({ theme }) => theme.spacing.l}),
      rgba(0, 0, 0, 0.3) 100%
    );
`;

interface IMediInfoProps {
  options: {
    item: IPlaylistItem;
  };
}

const AsyncComponentWrapper = ({ item }: { item: IPlaylistItem }): JSX.Element => {
  const AsyncComponent = React.lazy(async () => {
    try {
      const result = await window.commands.getVideoInfo(item.url);
      const MediaInfoContent = await import('./MediaInfoContent');
      return {
        default: ({ item }: { item: IPlaylistItem }) => {
          return (
            <MediaInfoContent.default
              item={item}
              videoInfo={result['videoInfo'] as ytdl.videoInfo}
            />
          );
        },
        result,
      };
    } catch (error) {
      console.error(error);
      return Promise.reject(error);
    }
  });

  return (
    <Suspense fallback={<Loading />}>
      <AsyncComponent item={item} />
    </Suspense>
  );
};

const MediaInfo = (props: IMediInfoProps): JSX.Element => {
  const { item } = props.options;
  const { t } = useTranslation();

  const handleCancelClick = async (): Promise<void> => {
    window.electron.ipcRenderer.send('close-modal', {
      sync: false,
    });
  };

  return (
    <MediaInfoContainer data-testid="media-info-container">
      <HeaderContainer>
        <StyledImg src={item.thumbnail}></StyledImg>
        <SpaceRight size="xs" />
        <AutoFitHeading>{item.title}</AutoFitHeading>
      </HeaderContainer>
      <Suspense fallback={<Loading />}>
        <AsyncComponentWrapper item={item} />
      </Suspense>
      <ButtonsContainer>
        <DarwinButton onClick={handleCancelClick}>{t('cancel')}</DarwinButton>
      </ButtonsContainer>
    </MediaInfoContainer>
  );
};

export default MediaInfo;
