import React, { useState } from 'react';
import styled from 'styled-components';
import { IPreferences } from 'types/types';

const StyledNav = styled.nav`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 10px;
  background-color: transparent;
  border-bottom: 1px solid ${({ theme }) => theme.colors.black};
  box-sizing: border-box;
  padding: ${({ theme }) => theme.spacing.s};
`;

const StyledList = styled.ul`
  list-style: none;
  padding: 0px;
  margin: 0px;
  overflow-y: scroll;
  height: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
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
    transition: all 200ms ease-in-out;
    margin: ${({ theme }) => theme.spacing.s};
  }
`;

const StyledLabel = styled.label`
  flex-basis: auto;
  align-items: center;
  border-radius: 6px;
  white-space: nowrap;
  cursor: pointer;
  white-space: nowrap;
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  transition: all 200ms ease-in-out;
  color: ${({ theme }) => theme.colors.lightGray}
`;

const StyledLabelContent = styled.span`
  display: flex;
  padding: ${({ theme }) => theme.spacing.xs};
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 6px;
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

interface INavBarProps {
  preferences?: IPreferences;
  pannels: Record<
    string,
    {
      icon: JSX.Element;
      node: JSX.Element;
    }
  >;
  defaultSelected?: string;
  onChange?: (id: string) => void;
}

const NavBar = (props: INavBarProps): JSX.Element => {
  const [checkedRadio, setCheckedRadio] = useState<string | undefined>(props.defaultSelected);

  const onChangeHandler = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const { id } = event.target;
    setCheckedRadio(id);
    props.onChange && props.onChange(id);
  };

  return (
    <StyledNav>
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
                  <StyledLabelContent data-testid="my-span">
                    {value.icon}
                    <span>{key}</span>
                  </StyledLabelContent>
                </StyledLabel>
              </StyledListItem>
            );
          })}
      </StyledList>
    </StyledNav>
  );
};

export default NavBar;
