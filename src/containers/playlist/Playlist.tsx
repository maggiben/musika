

import './Playlist.css';
import styled from 'styled-components';
import List from '@components/List/List';
// import InputRange from '@components/InputRange/InputRange';
// import { useTranslation } from 'react-i18next';
// import Controls from '@components/Player/Controls';
import PlayerControls from '@components/PlayerControls/PlayerControls';



const PlaylistContainer = styled.div`
  user-select: none;
  background-color: #212121;
  max-width: 480px;
  min-width: 480px;
  border: 1px solid #121212;
  box-shadow: 1px 1px 50px rgba(0, 0, 0, .5);
  border-radius: 1px;
  color: #484848;
  font-family: sans-serif;
  padding-bottom: 10px;
`;



// .playlist {
//   user-select: none;
//   background-color: #212121;
//   max-width: 480px;
//   min-width: 480px;
//   border: 1px solid #121212;
//   box-shadow: 1px 1px 50px rgba(0, 0, 0, .5);
//   border-radius: 1px;
//   color: #484848;
//   font-family: sans-serif;
//   padding-bottom: 10px;
// }

// const Controls = styled.div`
//   padding: 10px;
//   margin: 0px 10px 10px 10px;
//   border-bottom: 1px solid #313133;
//   /*background-color: #121212;*/
//   display: flex;
//   justify-content: space-between;
//   align-items: center;
//   & button {
//     outline: none;
//     border: none;
//     font-family: 'Material Icons';
//     font-size: 25px;
//     line-height: 1;
//     display: inline-block;
//     white-space: nowrap;
//     background-color: transparent;
//     color: #666;
//     text-align: center;
//     &:hover {
//       color: #c1c1c1;
//       background-color: #2f2f2f;
//     }
//   }
// `

// .list-x {
//   padding: 0px 20px;
//   max-height: 230px;
//   overflow: hidden;
//   overflow-y: scroll;
//   /*border: 1px solid #313133;*/
//   & ul {
//     list-style: none;
//     padding: 0px;
//     margin: 0px;
//   }
//   & .container {
//     width: 100%;
//     list-style: none;
//     padding: 0px;
//     margin: 0px;
//   }
//   & .row {
//     display: flex;
//     flex-direction: row;
//     flex-wrap: wrap;
//     margin: 8px 0px;
//   }
//   & ul > li > span {
//     /* This will make it work in Firefox >= 35.0a1 */
//     min-width: 0;
//     &:nth-child(1) {
//       text-align: right;
//       font-weight: bold;
//       flex-grow: 1;
//       flex-basis: 2%;
//     }
//     &:nth-child(2) {
//       flex-basis: content;
//       margin: 0px 6px;
//       text-align: center;
//       font-weight: bold;
//       color: red;
//     }
//     &:nth-child(3) {
//       flex-basis: 50%;
//       flex-grow: 1;
//     }
//     &.two {
//       min-width: 0;
//       flex-basis: 10%;
//       text-align: right;
//       align-self: flex-end;
//       flex-grow: 1;
//     }
//     & p {
//       text-overflow: ellipsis;
//       overflow: hidden;
//       white-space: nowrap;
//       margin: 0px;
//     }
//   }
// }


// progress {
//   display: block;
//   float: left;
//   width: 460px;
//   height: 8px;
//   border-radius: 5px;
//   appearance: none;
//   border: 1px solid #d8d8d8;
//   background: #ffffff;
//   margin-top: 10px;
//   transition: all 1s ease;
//   width: 100%;
// }
// progress::-webkit-progress-bar {
//   background:#ffffff;
//   border-radius:5px;
//   padding:1px;
// }
// progress::-webkit-progress-value {
//   background: #f89406;
//   border-radius: 5px;
// }
// progress[value="100"]::-webkit-progress-value{
//   background:#00FF00;
//   border-radius:5px;
// }
// progress:not([value])::-webkit-progress-bar{
//   background:#fdd;
// }

// .stars {
//   color: #484848;
//   display: flex;
//   flex-flow: row;
//   font-weight: lighter;
//   cursor: pointer;
//   & .full {
//     color: #d21d30;
//   }
// }

// input[type="range"] {
//   appearance: none;
//   height: 8px;
//   border-radius: 5px;
//   background: #2f2f2f;
//   outline: none;
// }

// input[type=range]::-webkit-slider-thumb {
//   appearance: none;
//   width: 16px;
//   height: 16px;
//   border-radius: 50%;
//   cursor: pointer;
//   transition: all .15s ease-in-out;
//   position: relative;
//   background: radial-gradient(ellipse at center, #2f2f2f 30%, #666 30%, #666 100%);
//   &:hover {
//     background: radial-gradient(ellipse at center, #2f2f2f 30%, #c1c1c1 30%, #c1c1c1 100%);
//   }
// }

// input[type="range"]:active::-webkit-slider-thumb {
//   background: radial-gradient(ellipse at center, #2f2f2f 30%, #fff 30%, #fff 100%);
// }

// input[type="range"]:focus {
//   outline: none; 
// }

// input[type="checkbox"] {
//   display: none;
// }

// input[type="checkbox"] + label {
//   outline: none;
//   border: none;
//   font-family: 'Material Icons';
//   font-size: 25px;
//   line-height: 1;
//   display: inline-block;
//   white-space: nowrap;
//   font-smoothing: antialiased;
//   background-color: transparent;
//   color: #666;
//   text-align: center;
  
//   display: inline-flex;
//   align-items: center;
//   justify-content: center;
//   transition: color .15s ease-in-out;
//   &:hover {
//     color: #c1c1c1;
//   }
// }
// input[type="checkbox"]:checked + label {
//  color: #d21d30;
// }

// .volume {
//   position: relative;
//   transition: all .5s ease-in-out;
//   &:hover .slider {
//     opacity: 1;
//     pointer-events: all;
//   }
//   & .slider {
//     opacity: 0;
//     pointer-events: none;
//     background-color: transparent;
//     position: absolute;
//     padding: 10px;
//     transform: rotate(90deg);
//     left: 100%;
//     transform-origin: 0% 0%;
//   }
// }

const Playlist = (): JSX.Element => {
  return (
    <div className="playlist">
      {/* <div className="controls">
        <div className="volume">
          <button type="button">volume_up</button>
          <div className="slider">
            <input id="seekslider" type="range" min="0" max="100" value="0" step="1" />
          </div>
        </div>
        <div className="button-group">
          <button type="button">fast_rewind</button>
          <button type="button" className="play">play_arrow</button>
          <button type="button">fast_forward</button>
        </div>
        <div className="button-group" style={{lineHeight: '1'}}>
          <input id="loop" type="checkbox" checked />
          <label htmlFor="loop">loop</label>
          <input id="shuffle" type="checkbox" />
          <label htmlFor="shuffle">shuffle</label>
        </div>
        <InputRange />
        <span>3:47</span>
      </div> */}
      {/* <Controls /> */}
      <PlayerControls />
      <div className="list-x" id="list">
        <List />
      </div>
    </div>
  )
}

export default Playlist;