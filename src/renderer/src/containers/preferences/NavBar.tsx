import React, { useState } from 'react';
import styled from 'styled-components';
import { IPreferences } from 'types/types';
import { StyledLabel } from '@components/Form/Form';
import { SpaceBottom } from '@renderer/components/Spacing/Spacing';

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
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;

const StyledListItem = styled.li`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  & [type='radio']:checked ~ label {
    color: ${({ theme }) => theme.colors.white};
    background-color: ${({ theme }) => theme.colors.softGray};
  }
  & label {
    transition: all 200ms ease-in-out;
    margin: ${({ theme }) => theme.spacing.s};
  }
`;

const StyledListItemLabel = styled(StyledLabel)`
  border-radius: ${({ theme }) => theme.borderRadius.xs};
  cursor: pointer;
  position: relative;
  display: flex;
  flex-direction: column;
  transition: all 150ms ease-in-out;
  &:hover {
    color: ${({ theme }) => theme.colors['label']};
  }
`;

const StyledLabelContent = styled.span`
  display: flex;
  padding: ${({ theme }) => theme.spacing.xs};
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 6px;
`;

const StyledInputRadio = styled.input.attrs({ type: 'radio' })`
  display: none;
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
                <StyledListItemLabel htmlFor={key}>
                  <StyledLabelContent data-testid="my-span">
                    {value.icon}
                    <SpaceBottom size="xxs" />
                    <span>{key}</span>
                  </StyledLabelContent>
                </StyledListItemLabel>
              </StyledListItem>
            );
          })}
      </StyledList>
    </StyledNav>
  );
};

export default NavBar;
