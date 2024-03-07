import './Playlist.css';
import { useState } from 'react';
import styled from 'styled-components';
import {
  StyledButton,
  FormControl,
  InputGroup,
  StyledTextarea,
} from '@renderer/components/Form/Form';
import { useTranslation } from 'react-i18next';

const NewPlaylistContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.xs};
  box-sizing: border-box;
  height: 100%;
  & > :not(:last-child) {
    margin-bottom: ${({ theme }) => theme.spacing.xs};
  }
`;

const ThumbnailContainer = styled.div`
  width: 240px;
  height: 240px;
  border: 2px solid ${({ theme }) => theme.colors.red};
`;

const ButtonsContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;

const NewPlaylist = (): JSX.Element => {
  const [imageSrc, setImageSrc] = useState('file:///Users/bmaggi/myprj/musika/build/icon.png');
  const { t } = useTranslation();

  const openFileDialog = async (): Promise<void> => {
    const result = await window.commands.dialogs({
      // defaultPath: preferences?.downloads?.savePath,
      properties: ['openFile'],
      filters: [{ name: 'Images', extensions: ['jpg', 'jpeg', 'png', 'gif'] }],
    });
    if (!result.canceled) {
      const filePath = result.filePaths[0];
      setImageSrc(filePath);
    }
  };

  const handleCancelClick = async (): Promise<void> => {
    window.electron.ipcRenderer.send('hide-modal', {
      sync: false,
    });
  };

  return (
    <NewPlaylistContainer>
      <ThumbnailContainer onClick={openFileDialog}>
        {imageSrc && (
          <img src={imageSrc} alt="Selected" style={{ maxWidth: '100%', maxHeight: '100%' }} />
        )}
      </ThumbnailContainer>
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
        <StyledButton onClick={handleCancelClick}>{t('cancel')}</StyledButton>
        <StyledButton disabled onClick={() => {}}>
          {t('create')}
        </StyledButton>
      </ButtonsContainer>
    </NewPlaylistContainer>
  );
};

export default NewPlaylist;
