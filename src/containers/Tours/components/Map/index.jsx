import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { changeMapViewport } from '../../../../redux/actions/mapActions';
import {
  createMarker,
  updateMarker,
  deleteMarker,
  changeActiveTourStep,
} from '../../../../redux/actions/tourActions';
import { MapProps, ToursProps } from '../../../../shared/prop-types/ReducerProps';
import FullscreenMap from './components/FullscreenMap';
import TourPanel from './components/TourPanel';
import MapPopover from './components/MapPopover';
import asyncLoading from '../../../../shared/components/asyncLoading';
import addTransitionClasses from '../../../../shared/utils/addTransitionClasses';

class Map extends Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    map: MapProps.isRequired,
    tours: ToursProps.isRequired,
  };

  // Thinking about moving this to a utils folder in shared
  getStep = stepId => this.props.tours.openTour.steps.filter(elem => elem.id === parseInt(stepId, 10))[0];

  getStepIndex = () => {
    const step = this.getStep(this.props.tours.openTour.activeTourStepId);
    return this.props.tours.openTour.steps.indexOf(step);
  };

  handleChangeMapViewport = newMapViewport => this.props.dispatch(changeMapViewport(newMapViewport));

  handleChangeToStepViewport = (id) => {
    // Update the viewport
    const step = addTransitionClasses(this.getStep(id));
    this.handleChangeMapViewport(step.viewport);

    // Set the active step in state and set the markers
    // array in state to the markers of the active step
    this.props.dispatch(changeActiveTourStep(id));
  };

  handleCreateMarker = (step) => {
    const newMarker = {
      name: 'New marker',
      text: 'Edit me. Move me around. Resize me. Do what you will...',
      longitude: this.props.map.viewport.longitude,
      latitude: this.props.map.viewport.latitude,
      width: 200,
      height: 200,
    };
    this.props.dispatch(createMarker(newMarker, step, this.getStepIndex()));
  };

  handleUpdateMarkerPosition = (e, marker, markerIndex) => {
    const newMarker = {
      ...marker,
      longitude: e.lngLat[0],
      latitude: e.lngLat[1],
    };
    // Clear up the naming conventions with regards to marker and newMarker
    const step = this.getStep(this.props.tours.openTour.activeTourStepId);
    this.props.dispatch(updateMarker(newMarker, markerIndex, step, this.getStepIndex()));
  };

  handleUpdateMarker = (marker, markerIndex, step) => {
    this.props.dispatch(updateMarker(marker, markerIndex, step, this.getStepIndex()));
  };

  handleDeleteMarker = (marker, step) => {
    this.props.dispatch(deleteMarker(marker, step, this.getStepIndex()));
  };

  render() {
    return (
      <>
        <FullscreenMap
          handleChangeMapViewport={this.handleChangeMapViewport}
          updateMarkerPosition={this.handleUpdateMarkerPosition}
          updateMarker={this.handleUpdateMarker}
          deleteMarker={this.handleDeleteMarker}
        />
        <TourPanel
          changeToStepViewport={this.handleChangeToStepViewport}
          createMarker={this.handleCreateMarker}
        />
        <MapPopover
          activeTourStepId={this.props.tours.openTour.activeTourStepId}
          openTour={this.props.tours.openTour}
          changeToStepViewport={this.handleChangeToStepViewport}
        />
      </>
    );
  }
}

export default asyncLoading('map')(withRouter(connect(state => ({
  map: state.map,
  tours: state.studio.tours,
}))(Map)));
