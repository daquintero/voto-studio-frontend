import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { changeMapViewport } from '../../../../redux/actions/mapActions';
import {
  changeActiveTourStep,
  closeOpenTour,
} from '../../../../redux/actions/tourActions';
import { ToursProps, MapProps } from '../../../../shared/prop-types/ReducerProps';
import FullscreenMap from './components/FullscreenMap';
import TourPanel from './components/TourPanel';
import PreviewPanel from './components/PreviewPanel';
import MapPopover from './components/MapPopover';
import asyncLoading from '../../../../shared/components/asyncLoading';
import addTransitionClasses from '../../../../shared/utils/addTransitionClasses';

class Map extends Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    tours: ToursProps.isRequired,
    map: MapProps.isRequired,
  };

  componentWillUnmount() {
    this.props.dispatch(closeOpenTour());
    this.handleChangeMapViewport(this.props.map.defaultViewport);
  }

  // Thinking about moving this to a utils folder in shared
  getStep = stepId => this.props.tours.openTour.steps.filter(elem => elem.id === parseInt(stepId, 10))[0];

  handleChangeMapViewport = newMapViewport => this.props.dispatch(changeMapViewport(newMapViewport));

  handleChangeToStepViewport = (id) => {
    // Update the viewport
    const step = addTransitionClasses(this.getStep(id));
    this.handleChangeMapViewport(step.viewport);

    // Set the active step in state and set the markers
    // array in state to the markers of the active step
    this.props.dispatch(changeActiveTourStep(id));
  };

  render() {
    const { tours } = this.props;
    return (
      <div style={{ overflow: 'hidden' }}>
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
        <PreviewPanel />
        <MapPopover
          activeTourStepId={tours.openTour.activeTourStepId}
          openTour={tours.openTour}
          changeToStepViewport={this.handleChangeToStepViewport}
        />
      </div>
    );
  }
}

export default asyncLoading('load__page')(withRouter(connect(state => ({
  tours: state.studio.tours,
  map: state.map,
}))(Map)));
