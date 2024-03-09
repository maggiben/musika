import React, { useState, useRef, useEffect, Suspense } from 'react';
import styled from 'styled-components';
import type ytdl from 'ytdl-core';
import type { IPlaylistItem } from 'types/types';
import {
  FormControl,
  InputGroup,
  InputPairContainer,
  StyledLabel,
  DarwinButton,
} from '@renderer/components/Form/Form';
import Loading from '@containers/loading/Loading';
import { useTranslation } from 'react-i18next';

const MediaInfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.xs};
  box-sizing: border-box;
  height: 100%;
  & > :not(:first-child):not(:last-child) {
    margin-bottom: ${({ theme }) => theme.spacing.xs};
  }
`;

const ButtonsContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;

const HeaderContainer = styled.div`
  --thumbnail-height: 120px;
  width: 100%;
  min-height: 140px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;
  overflow: hidden;
`;

const HeaderTitle = styled.h1`
  margin: 0;
  color: ${({ theme }) => theme.colors.white};
`;

const StyledImg = styled.img`
  width: auto;
  max-height: var(--thumbnail-height);
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
    <Suspense fallback={<div>Loading Async...</div>}>
      <AsyncComponent item={item} />
    </Suspense>
  );
};

// return { default: () => <StyledPre>{JSON.stringify(data, null, 2)}</StyledPre>, data }; // Pass the data along with the component

const MediaInfo = (props: IMediInfoProps): JSX.Element => {
  const { item } = props.options;
  const { t } = useTranslation();

  const handleCancelClick = async (): Promise<void> => {
    window.electron.ipcRenderer.send('close-modal', {
      sync: false,
    });
  };

  return (
    <MediaInfoContainer>
      <HeaderContainer>
        <StyledImg src={item.thumbnail}></StyledImg>
        <HeaderTitle>{item.title}</HeaderTitle>
      </HeaderContainer>
      <Suspense fallback={<Loading />}>
        {/* <AsyncComponent {...item}>
          {({ default: Component, data }) => (
            <>
              <pre style={{ width: '100%', height: '100%' }}>{JSON.stringify(data, null, 2)}</pre>
            </>
          )}
        </AsyncComponent> */}
        {/* <AsyncComponent {...item}>
          {({ default: Component, data }) => {
            console.log('data', data, 'Component', Component);
            return undefined;
          }}
        </AsyncComponent> */}
        <AsyncComponentWrapper item={item} />
      </Suspense>
      <ButtonsContainer>
        <DarwinButton onClick={handleCancelClick}>{t('cancel')}</DarwinButton>
        <DarwinButton disabled onClick={() => {}}>
          {t('create')}
        </DarwinButton>
      </ButtonsContainer>
    </MediaInfoContainer>
  );
};

export default MediaInfo;