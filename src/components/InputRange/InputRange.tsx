import React, { useEffect, useRef } from 'react';

export interface IInputRangeProps {
  min?: number;
  max?: number;
  value?: number;
  step?: number;
  onChange?: (value: number) => void;
}
const InputRange = (props: IInputRangeProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const drawTrack = (value: number | string, input: HTMLInputElement) => {
    const background = `linear-gradient(to right, #ed1e24 0%, #ed1e24 ${value}%, #2f2f2f ${value}%, #2f2f2f 100%)`;
    input.style.background = background;
  }

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    inputRef.current && drawTrack(parseFloat(event.target.value), inputRef.current);
    props.onChange && props.onChange(parseFloat(event.target.value));
  };

  useEffect(() => {
    inputRef.current && drawTrack(parseFloat(inputRef.current.value), inputRef.current);
  }, [])

  return (
    <input type="range" ref={inputRef} min={props.min} max={props.max} defaultValue={props.value} onChange={onChange} step={props.step} />
  );
}

export default InputRange;