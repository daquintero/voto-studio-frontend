import React from 'react';
import PropTypes from 'prop-types';
import { TourProps } from '../../../shared/prop-types/ReducerProps';
import TourStepControls from './TourStepControls';

const handleKeyPress = () => 42;

const TourStep = props => (
  <div
    className="tour-step__wrapper"
    onClick={e => props.changeToStepViewport(e)}
    onKeyPress={handleKeyPress}
    role="presentation"
    id={props.tourStep.id}
    style={{ zIndex: 9999 }}
  >
    <h4>Step {props.tourStep.id} | {props.tourStep.name}</h4>
    <p><small>{props.tourStep.text}</small></p>
    <hr />
    <p>Lat: {props.tourStep.viewport.latitude}</p>
    <p>Lng: {props.tourStep.viewport.longitude}</p>
    <p>Zoom: {props.tourStep.viewport.zoom}</p>
    <p>Pitch: {props.tourStep.viewport.pitch}</p>
    <p>Bearing: {props.tourStep.viewport.bearing}</p>
    <p>Transition Duration: {props.tourStep.viewport.transitionDuration}</p>
    <p>Transition Interpolator: {props.tourStep.viewport.transitionInterpolatorName}</p>
    <p>Transition Easing: {props.tourStep.viewport.transitionEasingName}</p>
    <hr />
    <TourStepControls />
  </div>
);

TourStep.propTypes = {
  tourStep: TourProps.isRequired,
  changeToStepViewport: PropTypes.func.isRequired,
};

export default TourStep;
