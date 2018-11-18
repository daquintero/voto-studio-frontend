import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Collapse } from 'reactstrap';
import { TourProps } from '../../../shared/prop-types/ReducerProps';
import TourStepControls from './TourStepControls';

class TourStep extends Component {
  static propTypes = {
    tourStep: TourProps.isRequired,
    changeToStepViewport: PropTypes.func.isRequired,
  };
  constructor(props) {
    super(props);
    this.state = {
      collapse: false,
    };
    this.toggle = this.toggle.bind(this);
  }
  toggle() {
    this.setState({ collapse: !this.state.collapse });
  }
  handleKeyPress() {
    return console.log(this);
  }
  render() {
    return (
      <div
        className="tour-step__wrapper"
        onClick={e => this.props.changeToStepViewport(e)}
        onKeyPress={this.handleKeyPress}
        role="presentation"
        id={this.props.tourStep.id}
      >
        <h4>Step {this.props.tourStep.id} | {this.props.tourStep.name}</h4>
        <p><small>{this.props.tourStep.text}</small></p>
        <hr />
        <Collapse isOpen={this.state.collapse}>
          <p>Lat: {this.props.tourStep.viewport.latitude}</p>
          <p>Lng: {this.props.tourStep.viewport.longitude}</p>
          <p>Zoom: {this.props.tourStep.viewport.zoom}</p>
          <p>Pitch: {this.props.tourStep.viewport.pitch}</p>
          <p>Bearing: {this.props.tourStep.viewport.bearing}</p>
          <p>Transition Duration: {this.props.tourStep.viewport.transitionDuration}</p>
          <p>Transition Interpolator: {this.props.tourStep.viewport.transitionInterpolatorName}</p>
          <p>Transition Easing: {this.props.tourStep.viewport.transitionEasingName}</p>
        </Collapse>
        <Button color="primary" onClick={this.toggle} style={{ marginBottom: '1rem' }}>
          { this.state.collapse ? 'Less' : 'More'}
        </Button>
        <TourStepControls />
      </div>
    );
  }
}

export default TourStep;
