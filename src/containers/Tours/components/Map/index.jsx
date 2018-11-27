import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import {
  changeMapWidth,
  changeMapHeight,
  changeMapViewport,
} from '../../../../redux/actions/mapActions';
import {
  createTourStep,
  deleteTourStep,
  reorderTourSteps,
  changeActiveTourStep,
  createMarker,
  updateMarker,
  deleteMarker,
} from '../../../../redux/actions/tourActions';
import { SidebarProps, MapProps, ToursProps } from '../../../../shared/prop-types/ReducerProps';
import FullscreenMap from './components/FullscreenMap';
import TourPanel from './components/TourPanel';
import MapPopover from './components/MapPopover';
import asyncLoading from '../../../../shared/components/asyncLoading';
import addTransitionClasses from '../../../../shared/utils/addTransitionClasses';

class Map extends Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    sidebar: SidebarProps.isRequired,
    map: MapProps.isRequired,
    tours: ToursProps.isRequired,
  };

  getStep = stepId => this.props.tours.openTour.steps.filter(elem => elem.id === parseInt(stepId, 10))[0];

  getStepIndex = () => {
    const step = this.getStep(this.props.tours.openTour.activeTourStepId);
    return this.props.tours.openTour.steps.indexOf(step);
  };

  handleChangeMapHeight = newMapHeight => this.props.dispatch(changeMapHeight(newMapHeight));

  handleChangeMapWidth = newMapWidth => this.props.dispatch(changeMapWidth(newMapWidth));

  handleChangeMapViewport = newMapViewport => this.props.dispatch(changeMapViewport(newMapViewport));

  handleCreateTourStep = (data) => {
    // Consider width and height values here, could be an issue. They MUST be overridden in the
    // client app.
    const step = {
      name: data.name,
      text: data.text,
      viewport: {
        ...this.props.map.viewport,
        transitionDuration: data.transitionDuration,
        transitionEasingName: data.transitionEasingName,
        transitionInterpolatorName: data.transitionInterpolatorName,
      },
      markers: [],
    };
    this.props.dispatch(createTourStep(step, this.props.tours.openTour.id));
  };

  handleDeleteTourStep = (id) => {
    this.props.dispatch(deleteTourStep(id));
  };

  handleChangeToStepViewport = (id) => {
    // Update the viewport
    const step = addTransitionClasses(this.getStep(id));
    this.handleChangeMapViewport(step.viewport);

    // Set the active step in state and set the markers
    // array in state to the markers of the active step
    this.props.dispatch(changeActiveTourStep(id));
  };

  handleOnDragEnd = (result) => {
    // Update state
    const { destination, source, draggableId } = result;
    const step = this.getStep(draggableId);
    if (!destination) {
      return;
    }
    if (destination.index === source.index) {
      return;
    }
    this.props.dispatch(reorderTourSteps(step, result));
  };

  handleCreateMarker = (step) => {
    const newMarker = {
      id: this.getNewId(step.markers),
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
    console.log(this.props);
    return ( // Maybe wrap these three in a wrapper component exported with asycLoading to have only one loading circle?
      <>
        <FullscreenMap
          sidebar={this.props.sidebar}
          map={this.props.map}
          handleChangeMapWidth={this.handleChangeMapWidth}
          handleChangeMapHeight={this.handleChangeMapHeight}
          handleChangeMapViewport={this.handleChangeMapViewport}
          openTour={this.props.tours.openTour}
          activeTourStepId={this.props.tours.openTour.activeTourStepId}
          updateMarkerPosition={this.handleUpdateMarkerPosition}
          createMarker={this.handleCreateMarker}
          updateMarker={this.handleUpdateMarker}
          deleteMarker={this.handleDeleteMarker}
        />
        <TourPanel
          openTour={this.props.tours.openTour}
          createTourStep={this.handleCreateTourStep}
          deleteTourStep={this.handleDeleteTourStep}
          changeToStepViewport={this.handleChangeToStepViewport}
          activeTourStepId={this.props.tours.openTour.activeTourStepId}
          createMarker={this.handleCreateMarker}
          onDragEnd={this.handleOnDragEnd}
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
  sidebar: state.sidebar,
  map: state.map,
  tours: state.studio.tours,
}))(Map)));
