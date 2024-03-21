import React, { useState, useEffect } from 'react';
import { getNestedProperty } from '@shared/lib/utils';
import { useRecoilValue } from 'recoil';
import { preferencesState } from '@states/atoms';

interface IFormHook {
  isDirty: boolean;
}

const useForm = (formRef: React.RefObject<HTMLFormElement>): IFormHook => {
  const preferences = useRecoilValue(preferencesState);
  const [isDirty, setIsDirty] = useState<boolean>(false);
  const findFormElements = (node: HTMLElement, elements: HTMLElement[] = []): HTMLElement[] => {
    if (node instanceof HTMLInputElement || node instanceof HTMLSelectElement) {
      elements.push({
        tagName: node.tagName,
        type: node.type,
        name: node.name,
      } as unknown as HTMLElement);
    } else if (node.childNodes && node.childNodes.length > 0) {
      for (let i = 0; i < node.childNodes.length; i++) {
        findFormElements(node.childNodes[i] as HTMLElement, elements);
      }
    }
    return elements;
  };

  useEffect(() => {
    if (!formRef.current) return;
    const onChangeHandler = (event: Event): void => {
      const target = event.target as HTMLElement;
      const type = target['type'];
      const name = target['name'];
      if (!['number', 'text', 'email', 'url', 'checkbox', 'radio', 'select-one'].includes(type))
        return;
      const orgVal = getNestedProperty(preferences, name);
      let newVal: unknown;
      switch (type) {
        case 'checkbox':
          newVal = target['checked'];
          break;
        case 'number':
          newVal = parseFloat(target['value']);
          break;
        default:
          newVal = target['value'];
      }
      console.log('name', name, orgVal, newVal);
      if (orgVal !== newVal) {
        setIsDirty(true);
      } else {
        setIsDirty(false);
      }
    };
    const formElements = findFormElements(formRef.current);
    console.log('formElements', formElements);
    const formElement = formRef.current;
    formElement.addEventListener('change', onChangeHandler);
    return () => {
      formElement.removeEventListener('change', onChangeHandler);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formRef]);

  return {
    isDirty,
  };
};

export default useForm;
