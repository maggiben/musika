import { Suspense, useState } from 'react';
import styled from 'styled-components';
import { useRecoilState } from 'recoil';
import { preferencesState } from '@states/atoms';
import { BsGear, BsCloudDownloadFill } from "react-icons/bs";
import DownloadPreferences from './DownloadPreferences';
import BehaviourPreferences from './BehaviourPreferences';
import NavBar from './NavBar';
import ActionButtons from './ActionButtons';

const PreferencesContainer = styled.div`
  width: 100%;
  height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const SidePannelContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  box-sizing: border-box;
  /* padding: ${({ theme }) => theme.spacing.xs}; */
  padding: 0px;
  background-color: ${({ theme }) => theme.colors.dark};
  color: ${({ theme }) => theme.colors.midGray};
  /* border-right: 1px solid ${({ theme }) => theme.colors.lightGray}; */
`;

const MainPannelContainer = styled.div`
  flex: 1 1 auto;
  width: 100%;
  height: 100%;
  display: flex;
  overflow: hidden;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
  background-color: ${({ theme }) => theme.colors.darkGray};
  color: ${({ theme }) => theme.colors.midGray};
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

  return (
    <PreferencesContainer>
      <SidePannelContainer data-testid="side-pannel-container">
        <Suspense fallback={<div>Loading...</div>}>
          <NavBar
            preferences={preferences}
            pannels={pannels}
            onChange={onSelectPreference}
            defaultSelected={selectedPreferenceGroup}
          />
        </Suspense>
      </SidePannelContainer>
      <MainPannelContainer data-testid="main-pannel-container">
        <Suspense fallback={<div>Loading...</div>}>
          <>{selectedPreferenceGroup && pannels[selectedPreferenceGroup].node}</>
        </Suspense>
        <ActionButtons />
      </MainPannelContainer>
    </PreferencesContainer>
  );
};

export default Preferences;
