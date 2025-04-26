import styled, { keyframes } from 'styled-components';

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const LoaderContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: ${props => props.fullScreen ? '100vh' : '200px'};
  width: 100%;
`;

const SpinnerWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Spinner = styled.div`
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  border-top: 4px solid var(--primary-color);
  width: ${props => props.size || '40px'};
  height: ${props => props.size || '40px'};
  animation: ${spin} 1s linear infinite;
  margin-bottom: 1rem;
`;

const LoadingText = styled.p`
  color: var(--dark-gray);
  font-size: 1rem;
`;

const Loader = ({ fullScreen = false, size, text = 'Loading...' }) => {
  return (
    <LoaderContainer fullScreen={fullScreen}>
      <SpinnerWrapper>
        <Spinner size={size} />
        {text && <LoadingText>{text}</LoadingText>}
      </SpinnerWrapper>
    </LoaderContainer>
  );
};

export default Loader;
