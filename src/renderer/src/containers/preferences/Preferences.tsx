import React, { useRef, useState, useEffect } from 'react';
import styled from 'styled-components';
import { useRecoilState } from 'recoil';
import { preferencesState } from '@states/atoms';
import { BsGear, BsCloudDownloadFill } from 'react-icons/bs';
import { StyledForm } from '@components/Form/Form';
import DownloadPreferences from './DownloadPreferences';
import BehaviourPreferences from './BehaviourPreferences';
import NavBar from './NavBar';
import ActionButtons from './ActionButtons';
import useModalResize from '@hooks/useModalResize';
import { getNestedProperty, setNestedProperty } from '@shared/lib/utils';

const PreferencesContainer = styled.div`
  width: 100%;
  height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const NavBarContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  box-sizing: border-box;
  padding: 0px;
  color: ${({ theme }) => theme.colors.midGray};
  min-height: 80px;
  max-height: 80px;
`;

const MainPannelContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  overflow: hidden;
  box-sizing: border-box;
  background-color: ${({ theme }) => theme.colors.darkGray};
  color: ${({ theme }) => theme.colors.midGray};
`;

export const PreferencesForm = styled(StyledForm)`
  padding: ${({ theme }) => theme.spacing.s};
`;

interface IFormProps {
  children: React.ReactNode;
  formRef: React.RefObject<HTMLFormElement>;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
}
export const Form = ({ children, onSubmit, formRef }: IFormProps): JSX.Element => {
  return (
    <PreferencesForm onSubmit={onSubmit} ref={formRef}>
      {React.Children.map(children, (child) => {
        if (!child) return;
        switch (typeof child) {
          case 'string':
            return child;
          case 'number':
            return child;
          case 'boolean':
            return child;
          default: {
            console.log('type', 'child:', child, 'childNodes', child['childNodes']);
            return child;
          }
        }
        // return child.props.name
        //   ? React.createElement(child.type, {
        //       ...{
        //         ...child.props,
        //         register: methods.register,
        //         key: child.props.name,
        //       },
        //     })
        //   : child;
      })}
    </PreferencesForm>
  );
};

const Preferences = (): JSX.Element => {
  const pannels = {
    behaviour: {
      icon: <BsGear />,
      node: (
        <>
          <BehaviourPreferences />
        </>
      ),
    },
    downloads: {
      icon: <BsCloudDownloadFill />,
      node: (
        <>
          <DownloadPreferences />
        </>
      ),
    },
  };

  const [preferences, setPreferences] = useRecoilState(preferencesState);
  const firstPreference = preferences && Object.keys(preferences).slice(0, 1).pop();
  const [selectedPreferenceGroup, setSelectedPreferenceGroup] = useState<string | undefined>(
    firstPreference,
  );
  const onSelectPreference = (id: string): void => setSelectedPreferenceGroup(id);
  const formRef = useRef<HTMLFormElement>(null);
  useModalResize(formRef, [selectedPreferenceGroup]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    if (!formRef.current) return;
    // Process the form data here, e.g., send it to a server
    const formData = new FormData(formRef.current);
    const inputs = Array.from(formRef.current.querySelectorAll('input'));
    const hash = new Map<string, unknown>();
    inputs.forEach((input) => {
      const type = input['type'];
      const name = input['name'];
      if (type === 'checkbox') {
        hash.set(name, input['checked']);
        formData.set(name, input['checked'] ? 'true' : 'false');
      }
      if (type === 'number') {
        hash.set(name, parseFloat(input.value));
      }
    });
    let clonedPreferences = structuredClone(preferences);
    for (const [key, value] of formData) {
      const newVal = hash.has(key) ? hash.get(key) : value;
      const orgVal = getNestedProperty(preferences, key);
      console.log('newVal: ', key, value);
      if (newVal !== orgVal) {
        clonedPreferences = setNestedProperty(clonedPreferences, key, newVal);
      }
    }

    // await window.preferences.savePreferences(clonedPreferences);
    // window.electron.ipcRenderer.send('close-modal', {
    //   syncPreferences: true,
    // });
  };

  return (
    <PreferencesContainer>
      <NavBarContainer data-testid="nav-bar-container">
        <NavBar
          preferences={preferences}
          pannels={pannels}
          onChange={onSelectPreference}
          defaultSelected={selectedPreferenceGroup}
        />
      </NavBarContainer>
      <MainPannelContainer data-testid="main-pannel-container">
        <Form
          formRef={formRef}
          onSubmit={handleSubmit}
          data-preferences-group={selectedPreferenceGroup}
        >
          {selectedPreferenceGroup && pannels[selectedPreferenceGroup].node}
        </Form>
      </MainPannelContainer>
      <ActionButtons formRef={formRef} />
    </PreferencesContainer>
  );
};

export default Preferences;
