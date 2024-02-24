
import './PlayerControls.css';
import styled from 'styled-components';
import InputRange from '@components/InputRange/InputRange';

const PlayerControlsContainer = styled.div`
  border-bottom: 1px solid #313133;
  display: flex;
  justify-content: space-between;
  align-items: center;
  & button {
    outline: none;
    border: none;
    font-family: 'Material Icons';
    line-height: 1;
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
  font-family: "Roboto Mono", monospace;
  margin-right: ${({ theme }) => theme.spacing.xxs};
`;

const PlayerControls = (): JSX.Element => {
  return (
    <PlayerControlsContainer>
      <div className="volume">
        <button>volume_up</button>
        <div className="slider">
          <input id="seekslider" type="range" min="0" max="100" value="0" step="1" />
        </div>
      </div>
      <div>
        <button>fast_rewind</button>
        <button className="play">play_arrow</button>
        <button>fast_forward</button>
      </div>
      <div style={{lineHeight: '1'}}>
        <input id="loop" type="checkbox" checked />
        <label htmlFor="loop">loop</label>
        <input id="shuffle" type="checkbox" />
        <label htmlFor="shuffle">shuffle</label>
      </div>
      <InputRange />
      <PlayTime>3:47</PlayTime>
    </PlayerControlsContainer>
  );
};

export default PlayerControls;
