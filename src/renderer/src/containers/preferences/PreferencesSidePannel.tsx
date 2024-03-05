import React, { useState } from 'react';
import styled from 'styled-components';
import { IPreferences } from 'types/types';

const StyledList = styled.ul`
  list-style: none;
  padding: 0px;
  margin: 0px;
  width: 100%;
  overflow-y: scroll;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
`;

const StyledListItem = styled.li`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  & [type='radio']:checked ~ label {
    color: ${({ theme }) => theme.colors.red};
    background-color: ${({ theme }) => theme.colors.softGray};
  }
  & label {
    display: flex;
    flex-direction: column;
  }
  /* & [type='radio']:checked ~ label::before {
    opacity: 1;
    visibility: visible;
    transform: scale(1);
  } */
`;

const StyledLabel = styled.label`
  flex-basis: auto;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.xs};
  display: block;
  white-space: nowrap;
  cursor: pointer;
  white-space: nowrap;
  position: relative;
  width: 100%;
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
  pannels: Record<string, unknown>;
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
        Object.entries(props.pannels).map(([key, value], index) => {
          return (
            <StyledListItem key={index}>
              <StyledInputRadio
                type="radio"
                name="preferences"
                id={key}
                onChange={onChangeHandler}
                checked={checkedRadio === key}
              />
              <StyledLabel htmlFor={key}>
                <i>{value?.['icon']}</i>
                <span>{key}</span>
              </StyledLabel>
            </StyledListItem>
          );
        })}
    </StyledList>
  );
};

export default PreferencesSidePannel;
