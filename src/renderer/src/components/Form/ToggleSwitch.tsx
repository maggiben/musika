import React from 'react';
import styled from 'styled-components';

const Label = styled.label`
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
`;

const Switch = styled.div`
  position: relative;
  width: 28px;
  height: 16px;
  background: rgb(179, 179, 179);
  border-radius: 32px;
  transition: 300ms all;

  &:before {
    transition: 300ms all;
    content: '';
    position: absolute;
    width: 12px;
    height: 12px;
    border-radius: 28px;
    top: 50%;
    left: 2px;
    background: white;
    transform: translate(0, -50%);
  }
`;

const Input = styled.input`
  opacity: 0;
  position: absolute;

  &:checked + ${Switch} {
    background: ${({ theme }) => theme.colors.accentColor};

    &:before {
      transform: translate(12px, -50%);
    }
  }
`;

type ToggleSwitchProps = React.InputHTMLAttributes<HTMLInputElement>;

const ToggleSwitch = (props: ToggleSwitchProps): JSX.Element => {
  return (
    <Label>
      <Input {...props} type="checkbox" />
      <Switch />
    </Label>
  );
};

export default ToggleSwitch;
