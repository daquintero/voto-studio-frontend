import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { changeMapViewport } from '../../../../redux/actions/mapActions';
import {
  changeActiveTourStep,
  closeOpenTour,
  initPublishTour,
  publishTour,
} from '../../../../redux/actions/tourActions';
import { ToursProps, MapProps } from '../../../../shared/prop-types/ReducerProps';
import FullscreenMap from './components/FullscreenMap';
import TourPanel from './components/TourPanel';
import PreviewPanel from './components/PreviewPanel';
import MapPopover from './components/MapPopover';
import asyncLoading from '../../../../shared/components/asyncLoading';
import addTransitionClasses from '../../../../shared/utils/addTransitionClasses';
import PublishModal from '../../../../shared/components/PublishModal';

class Map extends Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    tours: ToursProps.isRequired,
    map: MapProps.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      publishTourModal: false,
    };
  }

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

  handleTogglePublishTourModal = () => this.setState(prevState => ({ publishTourModal: !prevState.publishTourModal }));

  handlePublishTour = () => this.props.dispatch(publishTour(this.props.tours.openTour.id));

  handleOnClose = () => this.props.dispatch(initPublishTour());

  render() {
    const { tours } = this.props;
    return (
      <div className="tour-studio__wrapper">
        <FullscreenMap
          handleChangeMapViewport={this.handleChangeMapViewport}
          updateMarkerPosition={this.handleUpdateMarkerPosition}
          updateMarker={this.handleUpdateMarker}
          deleteMarker={this.handleDeleteMarker}
        />
        <TourPanel
          changeToStepViewport={this.handleChangeToStepViewport}
          createMarker={this.handleCreateMarker}
          togglePublishTourModal={this.handleTogglePublishTourModal}
          publishTourModal={this.state.publishTourModal}
        />
        <PreviewPanel />
        <MapPopover
          activeTourStepId={tours.openTour.activeTourStepId}
          openTour={tours.openTour}
          changeToStepViewport={this.handleChangeToStepViewport}
        />
        <PublishModal
          name={tours.openTour.name}
          action={tours.actions.PUBLISH_TOUR}
          publish={this.handlePublishTour}
          onClose={this.handleOnClose}
          isOpen={this.state.publishTourModal}
          toggle={this.handleTogglePublishTourModal}
        />
      </div>
    );
  }
}

export default asyncLoading('load__page')(withRouter(connect(state => ({
  tours: state.studio.tours,
  map: state.map,
}))(Map)));
