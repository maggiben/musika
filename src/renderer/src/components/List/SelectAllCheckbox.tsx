import React, { useEffect, useRef } from 'react';
import { useRecoilState } from 'recoil';
import { selectedItemsSelector } from '@states/selectors';

const SelectAllCheckbox = (): JSX.Element => {
  const [items, setItems] = useRecoilState(selectedItemsSelector);
  const checkboxRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (checkboxRef.current) {
      if (items.some((item) => item) && !items.every((item) => item)) {
        checkboxRef.current.indeterminate = true;
        checkboxRef.current.checked = false;
      } else if (items.every((item) => item)) {
        checkboxRef.current.indeterminate = false;
        checkboxRef.current.checked = true;
      } else if (!items.some((item) => item)) {
        checkboxRef.current.indeterminate = false;
        checkboxRef.current.checked = false;
      }
    }
  }, [items]);

  const handleAllSelect = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const { checked } = event.target;
    checked ? setItems(items.map(() => true)) : setItems(items.map(() => false));
  };

  return <input type="checkbox" ref={checkboxRef} onChange={handleAllSelect} />;
};

export default SelectAllCheckbox;
