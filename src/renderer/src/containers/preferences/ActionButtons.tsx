import React, { useState } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { DarwinButton } from '@renderer/components/Form/Form';
import { SpaceRight } from '@renderer/components/Spacing/Spacing';
import useForm from '@renderer/hooks/useForm';

const ActionButtonsContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  border-top: 1px solid ${({ theme }) => theme.colors['separator']};
`;

const ActionButtonsGroup = styled.div`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.s};
  display: flex;
  justify-content: flex-end;
  align-items: center;
`;

const Right = styled.div`
  flex: 1;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
`;

const Left = styled.div`
  flex: 1;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
`;

interface IActionButtonsProps {
  formRef: React.RefObject<HTMLFormElement>;
}

const ActionButtons = ({ formRef }: IActionButtonsProps): JSX.Element => {
  const { t } = useTranslation();
  const [didApplyChanges, setDidApplyChanges] = useState(false);
  const handleOkClick = async (): Promise<void> => {
    if (!formRef.current) return;
    const submitButton = formRef.current.querySelector('input[type="submit"]') as HTMLElement;
    formRef.current.requestSubmit(submitButton);
  };

  const handleApplyClick = async (): Promise<void> => {
    if (!formRef.current) return;
    setDidApplyChanges(true);
    formRef.current.requestSubmit();
  };

  const handleCancelClick = async (): Promise<void> => {
    window.electron.ipcRenderer.send('close-modal', {
      sync: false,
    });
  };

  const { isDirty } = useForm(formRef);

  return (
    <ActionButtonsContainer data-testid="action-buttons">
      <ActionButtonsGroup>
        <Left>
          <DarwinButton onClick={handleApplyClick} disabled={!isDirty}>
            {t('apply')}
          </DarwinButton>
        </Left>
        <Right>
          <DarwinButton onClick={() => {}}>{t('reset all')}</DarwinButton>
          <SpaceRight size="s" />
          <DarwinButton onClick={handleCancelClick}>{t('cancel')}</DarwinButton>
          <SpaceRight size="s" />
          <DarwinButton onClick={handleOkClick} disabled={didApplyChanges ? false : !isDirty}>
            {t('ok')}
          </DarwinButton>
        </Right>
      </ActionButtonsGroup>
    </ActionButtonsContainer>
  );
};

export default ActionButtons;
