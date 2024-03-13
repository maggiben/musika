import { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { StyledTextarea, DarwinButton } from '@renderer/components/Form/Form';
import { useTranslation } from 'react-i18next';
import { SpaceBottom } from '@renderer/components/Spacing/Spacing';

const NewPlaylistContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.s};
  box-sizing: border-box;
  height: 100%;
  & > :not(:first-child):not(:last-child) {
    margin-bottom: ${({ theme }) => theme.spacing.xs};
  }
`;

const ButtonsContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: end;
  align-items: center;
  margin-top: ${({ theme }) => theme.spacing.xs};
  width: 100%;
  & button {
    &:not(:last-child) {
      margin-right: ${({ theme }) => theme.spacing.xs};
    }
  }
`;

const OpenUrl = (): JSX.Element => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { t } = useTranslation();
  const [url, setUrl] = useState<string>('');

  const handleOnChage = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setUrl(event.target.value);
  };

  const handleCancelClick = (): void => {
    window.electron.ipcRenderer.send('close-modal', {
      sync: false,
    });
  };

  const handleOpenClick = (): void => {
    window.electron.ipcRenderer.send('close-modal', {
      url,
    });
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, []);

  return (
    <NewPlaylistContainer>
      <StyledTextarea
        ref={textareaRef}
        onChange={handleOnChage}
        placeholder={t('url')}
        style={{ flex: 1, resize: 'none' }}
      />
      <SpaceBottom size="s" />
      <ButtonsContainer>
        <DarwinButton onClick={handleCancelClick}>{t('cancel')}</DarwinButton>
        <DarwinButton disabled={!url} onClick={handleOpenClick}>
          {t('open')}
        </DarwinButton>
      </ButtonsContainer>
    </NewPlaylistContainer>
  );
};

export default OpenUrl;
