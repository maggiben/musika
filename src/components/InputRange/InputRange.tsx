import React from 'react';

export default class InputRange extends React.Component<{}> {
  constructor(...args: any) {
    super(args);
    this.drawTrack = this.drawTrack.bind(this)
  }
  handleChange(event) {
    this.setState({
      value: event.target.value
    });
    console.log('seekTo: ', event.target.value)
  }
  componentDidMount() {
    this.drawTrack();
    this.refs.range.addEventListener('change', this.drawTrack, false);
    this.refs.range.addEventListener('input', this.drawTrack, false);
  }
  drawTrack() {
    let value = this.state.value;
    let background = `linear-gradient(to right, #ed1e24 0%, #ed1e24 ${value}%, #2f2f2f ${value}%, #2f2f2f 100%)`;
    this.refs.range.style.background = background;
  }
  componentWillUnmount() {
    this.refs.range.removeEventListener('change', this.drawTrack);
    this.refs.range.removeEventListener('input', this.drawTrack);
  }
  state = {
    value: 50
  };
  static defaultProps = {
    min: 0,
    max: 100,
    step: 1
  };
  render() {
    return <input ref="range" type="range" min={this.props.min} max={this.props.max} value={this.state.value} onChange={this.handleChange.bind(this)} step={this.props.step} />
  }
}