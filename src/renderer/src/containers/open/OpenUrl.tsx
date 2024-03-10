import styled from 'styled-components';
import { StyledTextarea, DarwinButton } from '@renderer/components/Form/Form';
import { useTranslation } from 'react-i18next';
// import SearchBar from '@components/SearchBar/SearchBar';

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
  const { t } = useTranslation();

  const handleCancelClick = async (): Promise<void> => {
    window.electron.ipcRenderer.send('close-modal', {
      sync: false,
    });
  };

  const onSearch = ({ playlist }): void => {
    console.log('playlist', playlist);
  };

  return (
    <NewPlaylistContainer>
      <StyledTextarea placeholder={t('url')} style={{ flex: 1, resize: 'none' }} />
      <ButtonsContainer>
        <DarwinButton onClick={handleCancelClick}>{t('cancel')}</DarwinButton>
        <DarwinButton disabled onClick={() => {}}>
          {t('open')}
        </DarwinButton>
      </ButtonsContainer>
    </NewPlaylistContainer>
  );
};

export default OpenUrl;
