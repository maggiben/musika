import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

const ResultsHomeContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const HomeHeading = styled.h1`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  /* width: 100%;
  height: 100%; */
  /* color: ${({ theme }) => theme.colors.white}; */
`;

const ResultsHome = (): JSX.Element => {
  const { t } = useTranslation();
  return (
    <ResultsHomeContainer data-testid="results-home">
      <HomeHeading>{t('welcome home')}</HomeHeading>
    </ResultsHomeContainer>
  );
};

export default ResultsHome;
