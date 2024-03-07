import styled, { keyframes } from 'styled-components';

// Keyframe animation for spinning
const spin = keyframes`
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
`;

// Styled spinner component
const Spinner = styled.div`
  border: 16px solid gray;
  border-top: 16px solid white;
  border-radius: 50%;
  height: 120px;
  width: 120px;
  animation: ${spin} 1s linear infinite;
`;

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
