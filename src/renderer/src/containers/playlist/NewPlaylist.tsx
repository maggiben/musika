import './Playlist.css';
import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import {
  StyledButton,
  FormControl,
  InputGroup,
  StyledTextarea,
} from '@renderer/components/Form/Form';
import coverflowImage from '@assets/images/coverflow.svg';
import { useTranslation } from 'react-i18next';

const NewPlaylistContainer = styled.div`
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

const ThumbnailImg = styled.img`
  position: absolute;
  width: 100%;
  height: 100%;
  max-width: 100%;
  max-height: 100%;
  position: absolute;
  z-index: -1;
`;

const ButtonsContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;

const FileInputWrapper = styled.label`
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  opacity: 0;
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-size: cover;
    opacity: 0; /* Set the initial opacity of the pseudo-element */
  }
`;

const PlusSign = styled.span`
  /* backdrop-filter: invert(); */
  font-size: 36px;
  width: 100px;
  height: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: backdrop-filter 150ms ease-in-out;
`;

const ThumbnailContainer = styled.div`
  position: relative;
  width: 240px;
  height: 240px;
  margin: ${({ theme }) => theme.spacing.xl};
  border: 2px dashed ${({ theme }) => theme.colors.red};
  display: flex;
  justify-content: center;
  align-items: center;
  &:has(:only-child) > ${FileInputWrapper} {
    opacity: 0.75;
  }
  &:has(${ThumbnailImg}) > ${FileInputWrapper}:hover {
    opacity: 1;
    & > ${PlusSign} {
      backdrop-filter: blur(4px);
      border: 1px solid ${({ theme }) => theme.colors.white};
      -webkit-text-stroke: 1px ${({ theme }) => theme.colors.lightGray};
    }
  }
  & > ${FileInputWrapper}:hover {
    opacity: 1;
  }
`;

const FileInput = styled.input.attrs({ type: 'file' })`
  display: none;
`;

const NewPlaylist = (): JSX.Element => {
  const { t } = useTranslation();
  const [imageSrc, setImageSrc] = useState<string | undefined>(undefined);

  const handleCancelClick = async (): Promise<void> => {
    window.electron.ipcRenderer.send('close-modal', {
      sync: false,
    });
  };

  const handleImageError = (event: React.SyntheticEvent<HTMLImageElement, Event>): void => {
    event.stopPropagation();
    const target = event.target as HTMLImageElement;
    target.onerror = null; // Prevent infinite loop
    target.src = coverflowImage;
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      console.log(file);
      if (file) {
        const reader = new FileReader();
        reader.onload = () => {
          const base64 = reader.result as string;
          setImageSrc(base64);
        };
        reader.readAsDataURL(file);
      }
    }
  };

  console.log('imageSrc', imageSrc);
  return (
    <NewPlaylistContainer>
      <ThumbnailContainer>
        <FileInputWrapper>
          <FileInput
            type="file"
            onChange={handleFileUpload}
            multiple={false}
            accept="image/jpeg, image/png, image/gif, image/svg"
            title="Select Image"
          />
          <PlusSign>+</PlusSign>
        </FileInputWrapper>
        {imageSrc && (
          <ThumbnailImg
            src={imageSrc}
            alt="Playlist thumbnail"
            style={{ maxWidth: '100%', maxHeight: '100%' }}
            onError={handleImageError}
          />
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
