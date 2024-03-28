import './PlayerControls.css';
import styled from 'styled-components';
import InputRange from '@components/InputRange/InputRange';

const PlayerControlsContainer = styled.div`
  --min-height: 48px;
  --background-color: ${({ theme }) =>
    theme.colors['window-background']}; /* any format you want here */
  --background-color-darker: color-mix(in srgb, var(--background-color), #000 25%);
  --background-color-darkest: color-mix(in srgb, var(--background-color), #000 50%);
  background-color: var(--background-color-darkest);
  min-height: var(--min-height);
  width: 100%;
  flex: 1 1 auto;
  border-bottom: 1px solid #313133;
  display: flex;
  justify-content: space-between;
  align-items: center;
  & button {
    outline: none;
    border: none;
    font-family: 'Material Icons';
    line-height: 1;
    font-size: 1.75rem;
    display: inline-block;
    white-space: nowrap;
    background-color: transparent;
    color: #666;
    text-align: center;
    &:hover {
      color: #c1c1c1;
      /* background-color: #2f2f2f; */
    }
  }
`;

const PlayTime = styled.span`
  font-family: 'Roboto Mono', monospace;
  margin-right: ${({ theme }) => theme.spacing.xxs};
`;

const Slider = styled.div`
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  transform: rotate(90deg) translate(0%, 50%);
  top: 0.75em;
  left: 50%;
  transform-origin: 0% 100%;
  z-index: 1;
`;

const Volume = styled.div`
  position: relative;
  & ${Slider} {
    display: none;
  }
  &:hover {
    & ${Slider} {
      display: flex;
    }
  }
`;
const PlayerControls = (): JSX.Element => {
  return (
    <PlayerControlsContainer data-testid="playlist-controls">
      <Volume>
        <button style={{ position: 'relative' }}>
          volume_up
          <Slider>
            <InputRange min="0" max="100" value="0" step="1" />
          </Slider>
        </button>
      </Volume>
      <div style={{ lineHeight: '1rem' }}>
        <button>fast_rewind</button>
        <button className="play">play_arrow</button>
        <button>fast_forward</button>
      </div>
      <div style={{ lineHeight: '1' }}>
        <input id="loop" type="checkbox" />
        <label htmlFor="loop">loop</label>
        <input id="shuffle" type="checkbox" />
        <label htmlFor="shuffle">shuffle</label>
      </div>
      <InputRange style={{ minWidth: '180px' }} />
      <PlayTime>3:47</PlayTime>
    </PlayerControlsContainer>
  );
};

export default PlayerControls;
