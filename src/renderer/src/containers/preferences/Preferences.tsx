import { useRef, useState } from 'react';
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

  const [preferences] = useRecoilState(preferencesState);
  const firstPreference = preferences && Object.keys(preferences).slice(0, 1).pop();
  const [selectedPreferenceGroup, setSelectedPreferenceGroup] = useState<string | undefined>(
    firstPreference,
  );
  const onSelectPreference = (id: string): void => setSelectedPreferenceGroup(id);
  const formRef = useRef<HTMLFormElement>(null);
  useModalResize(formRef, [selectedPreferenceGroup]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    if (!formRef.current) return;
    // Process the form data here, e.g., send it to a server
    const formData = new FormData(formRef.current);
    console.log(formData);
    for (const [key, value] of formData) {
      console.log('form key', key, 'value', value);
    }

    // await window.preferences.savePreferences(preferences);
    // window.electron.ipcRenderer.send('close-modal', {
    //   sync: true,
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
        <PreferencesForm
          ref={formRef}
          onSubmit={handleSubmit}
          data-current-form={selectedPreferenceGroup}
        >
          {selectedPreferenceGroup && pannels[selectedPreferenceGroup].node}
        </PreferencesForm>
      </MainPannelContainer>
      <ActionButtons formRef={formRef} />
    </PreferencesContainer>
  );
};

export default Preferences;
