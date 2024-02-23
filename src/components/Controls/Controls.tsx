
/*
.controls {
  padding: 10px;
  border-bottom: 1px solid #313133;
  display: flex;
  justify-content: space-between;
  align-items: center;
  & button {
    outline: none;
    border: none;
    font-family: 'Material Icons';
    font-size: 25px;
    line-height: 1;
    display: inline-block;
    white-space: nowrap;
    background-color: transparent;
    color: #666;
    text-align: center;
    &:hover {
      color: #c1c1c1;
      background-color: #2f2f2f;
    }
  }
}

*/
import styled from 'styled-components';

const ControlsContainer = styled.div`
  padding: 10px;
  border-bottom: 1px solid #313133;
  display: flex;
  justify-content: space-between;
  align-items: center;
  & button {
    outline: none;
    border: none;
    font-family: 'Material Icons';
    font-size: 25px;
    line-height: 1;
    display: inline-block;
    white-space: nowrap;
    background-color: transparent;
    color: #666;
    text-align: center;
    &:hover {
      color: #c1c1c1;
      background-color: #2f2f2f;
    }
  }
`;

const Controls = (): JSX.Element => {
  return (
    <ControlsContainer>
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
      <div id="range"></div>
      <span>3:47</span>
    </ControlsContainer>
  );
};

export default Controls;
