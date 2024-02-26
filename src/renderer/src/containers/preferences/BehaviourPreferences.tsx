import React, { useEffect, Suspense, useState } from 'react';
import styled, { css } from 'styled-components';
import { useTranslation } from 'react-i18next';
import { useRecoilState, useRecoilValue } from 'recoil';
import { preferencesState } from '@states/atoms';
// import { useTranslation } from 'react-i18ne

import {
  StyledForm,
  StyledLabel,
  StyledDFieldset,
  StyledButton,
  FormControl,
  InputGroup,
  InputPairContainer,
} from '@renderer/components/Form/Form';

const BehaviourPreferences = (): JSX.Element => {
  const {
    t,
    i18n: { options },
  } = useTranslation();
  const [preferences, setPreferences] = useRecoilState(preferencesState);
  console.log('resources', options.resources);
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
                <StyledButton type="button" id="button" onClick={() => {}}>
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

export default BehaviourPreferences;
