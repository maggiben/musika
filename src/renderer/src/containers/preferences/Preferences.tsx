import { Suspense, useState } from 'react';
import styled from 'styled-components';
import { useRecoilState } from 'recoil';
import { preferencesState } from '@states/atoms';
import DownloadPreferences from './DownloadPreferences';
import BehaviourPreferences from './BehaviourPreferences';
import PreferencesSidePannel from './PreferencesSidePannel';

const PreferencesContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;

const SidePannelContainer = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  background-color: ${({ theme }) => theme.colors.darkGray};
  color: ${({ theme }) => theme.colors.midGray};
  /* padding: ${({ theme }) => theme.spacing.xs}; */
  border-right: 1px solid ${({ theme }) => theme.colors.lightGray};
`;

const MainPannelContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: ${({ theme }) => theme.colors.darkGray};
  color: ${({ theme }) => theme.colors.midGray};
`;

const Preferences = (): JSX.Element => {
  const pannels = {
    downloads: (
      <>
        <DownloadPreferences />
      </>
    ),
    behaviour: (
      <>
        <BehaviourPreferences />
      </>
    ),
    // advanced: <AdvancedContainer />,
  };
  const [preferences] = useRecoilState(preferencesState);
  // const firstPreference = preferences && Object.keys(preferences).slice(0, 1).pop();
  const [selectedPreferenceGroup, setSelectedPreferenceGroup] = useState<string>(
    /* firstPreference ?? */ 'downloads',
  );
  const onSelectPreference = (id: string): void => {
    console.log('id', id);
    setSelectedPreferenceGroup(id);
  };

  return (
    <PreferencesContainer>
      <SidePannelContainer>
        <Suspense fallback={<div>Loading...</div>}>
          <PreferencesSidePannel
            preferences={preferences}
            onChange={onSelectPreference}
            defaultSelected={selectedPreferenceGroup}
          />
        </Suspense>
      </SidePannelContainer>
      <MainPannelContainer>
        <Suspense fallback={<div>Loading...</div>}>{pannels[selectedPreferenceGroup]}</Suspense>
      </MainPannelContainer>
    </PreferencesContainer>
  );
};

export default Preferences;
