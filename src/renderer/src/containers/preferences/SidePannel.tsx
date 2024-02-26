import styled, { css } from 'styled-components';
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

const Peferences = (): JSX.Element => {
  return (
    <PreferencesContainer>
      <SidePannelContainer />
      <MainPannelContainer />
    </PreferencesContainer>
  );
};

export default Peferences;
