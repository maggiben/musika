import React, { useEffect, Suspense, useState } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { useRecoilState, useRecoilValue } from 'recoil';
import { preferencesState } from '@states/atoms';
import { IPreferences } from 'types/types';
// import { useTranslation } from 'react-i18next';
import {
  StyledForm,
  StyledLabel,
  StyledDFieldset,
  StyledButton,
  FormControl,
  InputGroup,
  InputPairContainer,
} from '@renderer/components/Form/Form';

const DownloadPreferences = (): JSX.Element => {
  const { t } = useTranslation();
  const [preferences, setPreferences] = useRecoilState(preferencesState);
  const openFolderDialog = async (): Promise<void> => {
    const result = (await window.commands.dialogs({
      defaultPath: preferences?.downloads?.savePath,
      properties: ['openDirectory', 'promptToCreate'],
      createDirectory: true,
    })) as { canceled: boolean; filePaths: string[] };
    const savePath = result.filePaths[0];
    !result.canceled && setPreferences({ ...preferences, downloads: { savePath } });
  };

  return (
    <>
      <StyledForm
        onSubmit={(e) => {
          e.preventDefault();
        }}
      >
        <StyledDFieldset>
          <legend>{t('downloads')}</legend>
          <div>
            <InputPairContainer>
              <StyledLabel htmlFor="savePath">{t('save files to')}</StyledLabel>
              <InputGroup>
                <FormControl
                  type="text"
                  id="savePath"
                  name="savePath"
                  className="form-control"
                  defaultValue={preferences?.downloads?.savePath}
                  placeholder={t('save files to')}
                />
                <StyledButton type="button" id="button" onClick={openFolderDialog}>
                  {t('open folder')}
                </StyledButton>
              </InputGroup>
            </InputPairContainer>
            <InputPairContainer>
              <StyledLabel htmlFor="maxconnections">{t('max connections')}</StyledLabel>
              <InputGroup>
                <FormControl
                  type="number"
                  id="maxconnections"
                  name="maxconnections"
                  min="1"
                  max="100"
                  className="form-control"
                  defaultValue={preferences?.downloads?.maxconnections}
                  placeholder={t('max connections')}
                />
              </InputGroup>
            </InputPairContainer>
            <InputPairContainer>
              <StyledLabel htmlFor="retries">{t('retries')}</StyledLabel>
              <InputGroup>
                <FormControl
                  type="number"
                  id="retries"
                  name="retries"
                  min="1"
                  max="100"
                  className="form-control"
                  defaultValue={preferences?.downloads?.retries}
                  placeholder={t('retries')}
                />
              </InputGroup>
            </InputPairContainer>
            <InputPairContainer>
              <StyledLabel htmlFor="timeout">{t('timeout')}</StyledLabel>
              <InputGroup>
                <FormControl
                  type="number"
                  id="timeout"
                  name="timeout"
                  min="10000"
                  max="600000"
                  className="form-control"
                  defaultValue={preferences?.downloads?.timeout}
                  placeholder={t('timeout')}
                />
              </InputGroup>
            </InputPairContainer>
          </div>
        </StyledDFieldset>
      </StyledForm>
    </>
  );
};

export default DownloadPreferences;
