import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import {
  FormControl,
  InputGroup,
  StyledTextarea,
  DarwinButton,
} from '@renderer/components/Form/Form';
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
  align-items: center;
  overflow: hidden;
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

const MediaInfo = (): JSX.Element => {
  const { t } = useTranslation();

  const handleCancelClick = async (): Promise<void> => {
    window.electron.ipcRenderer.send('close-modal', {
      sync: false,
    });
  };

  return (
    <MediaInfoContainer>
      <HeaderContainer>
        <StyledImg src="https://picsum.photos/320/320"></StyledImg>
      </HeaderContainer>
      <InputGroup>
        <FormControl
          type="text"
          id="playlist-title"
          name="playlist-title"
          placeholder="Playlist Title"
        />
      </InputGroup>
      <StyledTextarea placeholder="Description (Optional)" style={{ flex: 1, resize: 'none' }} />
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
