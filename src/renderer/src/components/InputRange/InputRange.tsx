import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';

const InputRangeComponent = styled.input`
  appearance: none;
  height: 8px;
  border-radius: ${({ theme }) => theme.borderRadius.m};
  background: #2f2f2f;
  outline: none;
  &[type='range']::-webkit-slider-thumb {
    appearance: none;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    cursor: pointer;
    transition: all 0.15s ease-in-out;
    position: relative;
    background: radial-gradient(ellipse at center, #2f2f2f 30%, #666 30%, #666 100%);
    &:hover {
      background: radial-gradient(ellipse at center, #2f2f2f 30%, #c1c1c1 30%, #c1c1c1 100%);
    }
  }

  &[type='range']:active::-webkit-slider-thumb {
    background: radial-gradient(ellipse at center, #2f2f2f 30%, #fff 30%, #fff 100%);
  }

  &[type='range']:focus {
    outline: none;
  }
`;

export interface IInputRangeProps {
  min?: number | string;
  max?: number | string;
  value?: number | string;
  step?: number | string;
  onChange?: (value: number) => void;
}
const InputRange = (props: IInputRangeProps): JSX.Element => {
  const inputRef = useRef<HTMLInputElement>(null);
  const drawTrack = (value: number | string, input: HTMLInputElement): void => {
    const background = `linear-gradient(to right, #ed1e24 0%, #ed1e24 ${value}%, #2f2f2f ${value}%, #2f2f2f 100%)`;
    input.style.background = background;
  };

  const onChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    inputRef.current && drawTrack(parseFloat(event.target.value), inputRef.current);
    props.onChange && props.onChange(parseFloat(event.target.value));
  };

  useEffect(() => {
    inputRef.current && drawTrack(parseFloat(inputRef.current.value), inputRef.current);
  }, []);

  return (
    <InputRangeComponent
      type="range"
      ref={inputRef}
      min={props.min}
      max={props.max}
      defaultValue={props.value}
      onChange={onChange}
      step={props.step}
    />
  );
};

export default InputRange;
