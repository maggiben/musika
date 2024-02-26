import styled, { css } from 'styled-components';
import { useRecoilState } from 'recoil';
import { preferencesState } from '@states/atoms';
// import { useTranslation } from 'react-i18next';

const PreferencesContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;

const SidePannelContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: red;
`;

const MainPannelContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: blue;
`;

const PreferencesPannel = (): JSX.Element => {
  const [preferences, setPreferences] = useRecoilState(preferencesState);
  return (
    <>
      {preferences && Object.entries(preferences).map(([key, value]) => (
        <h1>Hello</h1>
      ))}
    </>
  );
};

const Preferences = (): JSX.Element => {
  return (
    <PreferencesContainer>
      <SidePannelContainer>
        <PreferencesPannel />
      </SidePannelContainer>
      <MainPannelContainer />
    </PreferencesContainer>
  );
};

export default Preferences;
