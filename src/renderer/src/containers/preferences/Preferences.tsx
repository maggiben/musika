import React, { useEffect, Suspense, useState } from 'react';
import styled, { css } from 'styled-components';
import { useTranslation } from 'react-i18next';
import type { IpcMainInvokeEvent } from 'electron';
import { useRecoilState, useRecoilValue } from 'recoil';
import { preferencesState } from '@states/atoms';
import { preferencesSelector } from '@states/selectors';
import { IPreferences } from 'types/types';
// import { useTranslation } from 'react-i18next';

const PreferencesContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;

const SidePannelContainer = styled.div`
  height: 100%;
  min-width: 220px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  background-color: ${({ theme }) => theme.colors.darkGray};
  color: ${({ theme }) => theme.colors.midGray};
  /* padding: ${({ theme }) => theme.spacing.xs}; */
`;

const StyledList = styled.ul`
  list-style: none;
  padding: 0px;
  margin: 0px;
  width: 100%;
  overflow-y: scroll;
`;

const StyledListItem = styled.li`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  & [type='radio']:checked ~ label {
    color: ${({ theme }) => theme.colors.red};
  }
  /* & [type='radio']:checked ~ label::before {
    opacity: 1;
    visibility: visible;
    transform: scale(1);
  } */
`;

const StyledLabel = styled.label`
  display: inline-flex;
  width: 100%;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.xs};

  display: block;
  cursor: pointer;
  white-space: nowrap;
  position: relative;
  /* transition: 0.4s ease-in-out 0s; */

  /* &:after,
  &:before {
    content: '';
    position: absolute;
    border-radius: 50%;
  }

  &:after {
    height: 19px;
    width: 19px;
    border: 2px solid #524eee;
    left: 19px;
    top: calc(50% - 12px);
  }
  &:before {
    background: #524eee;
    height: 20px;
    width: 20px;
    left: 21px;
    top: calc(50%-5px);
    transform: scale(5);
    opacity: 0;
    visibility: hidden;
    transition: 0.4s ease-in-out 0s;
  } */
`;

const StyledInputRadio = styled.input`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  border: none;
  border-radius: 0;
  padding: ${({ theme }) => theme.spacing.xs};
  &.active {
    color: ${({ theme }) => theme.colors.red};
  }
  &[type='radio'] {
    display: none;
  }
`;

interface IPreferencesSidePannelProps {
  preferences?: IPreferences;
  defaultSelected?: string;
  onChange?: (id: string) => void;
}
const PreferencesSidePannel = (props: IPreferencesSidePannelProps): JSX.Element => {
  const [checkedRadio, setCheckedRadio] = useState<string | undefined>(props.defaultSelected);

  const onChangeHandler = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const { id } = event.target;
    setCheckedRadio(id);
    props.onChange && props.onChange(id);
  };

  return (
    <StyledList>
      {props.preferences &&
        Object.entries(props.preferences).map(([key], index) => {
          return (
            <StyledListItem key={index}>
              {/* <StyledSideBarButton>{key}</StyledSideBarButton> */}
              <StyledInputRadio
                type="radio"
                name="preferences"
                id={key}
                onChange={onChangeHandler}
                checked={checkedRadio === key}
              />
              <StyledLabel htmlFor={key}>{key}</StyledLabel>
            </StyledListItem>
          );
        })}
    </StyledList>
  );
};

const MainPannelContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: transparent;
`;

// Styled components for the input pair
const InputPairContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  & label {
    flex-basis: 30%;
  }
`;

const StyledForm = styled.form`
  /* display: flex;
  flex-direction: column; */
  width: 100%;
  height: 100%;
`;

const StyledInput = styled.input`
  width: 100%;
  width: 100%;
  color: ${({ theme }) => theme.colors.white};
  border: 0px solid transparent;
  &::placeholder {
    color: ${({ theme }) => theme.colors.white};
  }
`;

const StyledSelect = styled.select`
  width: 100%;
`;

const BehaviourPreferences = (): JSX.Element => {
  const {
    t,
    i18n: { options },
  } = useTranslation();
  console.log('resources', options.resources);
  return (
    <>
      <StyledForm>
        <fieldset>
          <legend>Interface {t('caca')}</legend>
          <span>Changing Interface settings requires application restart</span>
          <div>
            <InputPairContainer>
              <label htmlFor="fname">First Name:</label>
              <StyledInput type="text" id="fname" name="fname" />
            </InputPairContainer>
            <InputPairContainer>
              <label htmlFor="email">Email:</label>
              <StyledInput type="email" id="email" name="lname" />
            </InputPairContainer>
            <InputPairContainer>
              <label htmlFor="email">Gender:</label>
              <StyledSelect>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </StyledSelect>
            </InputPairContainer>
            <InputPairContainer>
              <StyledInput type="checkbox" id="caca2" style={{ width: 'auto' }} />
              <label htmlFor="caca2">Other1:</label>
            </InputPairContainer>
            <InputPairContainer>
              <StyledInput type="radio" id="caca2" style={{ width: 'auto' }} />
              <label htmlFor="caca2">Other:</label>
            </InputPairContainer>
          </div>
        </fieldset>
      </StyledForm>
    </>
  );
};

const DownloadPreferences = (): JSX.Element => {
  const {
    t,
    i18n: { options },
  } = useTranslation();
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
        <fieldset>
          <legend>Interface {t('caca')}</legend>
          <span>When downloading content</span>
          <div>
            <InputPairContainer>
              <label htmlFor="savePath">save path:</label>
              <StyledInput
                type="text"
                id="savePath"
                name="savePath"
                placeholder={preferences?.downloads?.savePath}
              />
              <button onClick={openFolderDialog}>openDirectory</button>
            </InputPairContainer>
            <InputPairContainer>
              <label htmlFor="email">Email:</label>
              <StyledInput type="email" id="email" name="lname" />
            </InputPairContainer>
          </div>
        </fieldset>
      </StyledForm>
    </>
  );
};

const Preferences = (): JSX.Element => {
  const pannels = {
    downloads: (
      <>
        <DownloadPreferences />
      </>
    ),
    behaviour: (
      <>
        <BehaviourPreferences />
      </>
    ),
    // advanced: <AdvancedContainer />,
  };
  const [preferences, setPreferences] = useRecoilState(preferencesState);
  const firstPreference = preferences && Object.keys(preferences).slice(0, 1).pop();
  const [selectedPreferenceGroup, setSelectedPreferenceGroup] = useState<string>(
    firstPreference ?? 'downloads',
  );
  const onSelectPreference = (id: string): void => {
    console.log('id', id);
    setSelectedPreferenceGroup(id);
  };

  return (
    <PreferencesContainer>
      <SidePannelContainer>
        <Suspense fallback={<div>Loading...</div>}>
          <PreferencesSidePannel
            preferences={preferences}
            onChange={onSelectPreference}
            defaultSelected={selectedPreferenceGroup}
          />
        </Suspense>
      </SidePannelContainer>
      <MainPannelContainer>
        <Suspense fallback={<div>Loading...</div>}>{pannels[selectedPreferenceGroup]}</Suspense>
      </MainPannelContainer>
    </PreferencesContainer>
  );
};

export default Preferences;
