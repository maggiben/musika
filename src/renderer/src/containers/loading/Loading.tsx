import styled from 'styled-components';

// Container to center the spinner
const CenteredContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100vh;
`;

// CenteredSpinner component
const Loading = (): JSX.Element => (
  <CenteredContainer>
    <span>Loading...</span>
  </CenteredContainer>
);

export default Loading;
