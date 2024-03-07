import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { useRecoilValue } from 'recoil';
import { preferencesState } from '@states/atoms';
import { StyledButton } from '@renderer/components/Form/Form';

const ActionButtonsContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  /* border-top: 1px solid ${({ theme }) => theme.colors.lightGray}; */
`;

const ActionButtonsGroup = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  & button {
    &:not(:last-child) {
      margin-right: ${({ theme }) => theme.spacing.xs};
    }
  }
`;

const ActionButtons = (): JSX.Element => {
  const { t } = useTranslation();
  const preferences = useRecoilValue(preferencesState);
  const handleOkClick = async (): Promise<void> => {
    await window.preferences.savePreferences(preferences);
    window.electron.ipcRenderer.send('close-modal', {
      sync: true,
    });
  };

  const handleCancelClick = async (): Promise<void> => {
    window.electron.ipcRenderer.send('close-modal', {
      sync: false,
    });
  };

  return (
    <ActionButtonsContainer>
      <ActionButtonsGroup>
        <StyledButton onClick={handleCancelClick}>{t('cancel')}</StyledButton>
        <StyledButton onClick={handleOkClick}>{t('ok')}</StyledButton>
      </ActionButtonsGroup>
    </ActionButtonsContainer>
  );
};

export default ActionButtons;
