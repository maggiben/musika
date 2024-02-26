import { useEffect, Suspense, useState } from 'react';
import styled, { css } from 'styled-components';
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

const MainPannelContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: blue;
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

interface IPreferencesPannelProps {
  preferences?: IPreferences;
  onChange?: (id: string) => void;
}
const PreferencesPannel = (props: IPreferencesPannelProps): JSX.Element => {
  const [checkedRadio, setCheckedRadio] = useState<string | undefined>();

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

const Preferences = (): JSX.Element => {
  const [preferences, setPreferences] = useRecoilState(preferencesState);

  const onSelectPreference = (id: string): void => {
    console.log('id', id);
  };

  return (
    <PreferencesContainer>
      <SidePannelContainer>
        <Suspense fallback={<div>Loading...</div>}>
          <PreferencesPannel preferences={preferences} onChange={onSelectPreference} />
        </Suspense>
      </SidePannelContainer>
      <MainPannelContainer />
    </PreferencesContainer>
  );
};

export default Preferences;
