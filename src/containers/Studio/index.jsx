import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { FlyToInterpolator, LinearInterpolator } from 'deck.gl';
import * as d3 from 'd3';
import {
  changeMapWidth,
  changeMapHeight,
  changeMapViewport,
} from '../../redux/actions/mapActions';
import {
  toggleNewTourModal,
  createTour,
  createTourStep,
  deleteTourStep,
  updateTourStep,
} from '../../redux/actions/tourActions';
import { SidebarProps, MapProps, ToursProps } from '../../shared/prop-types/ReducerProps';
import FullscreenMap from './components/FullscreenMap';
import NewTourModal from './components/NewTourModal';
import TourPanel from './components/TourPanel';
import MapPopover from './components/MapPopover';

class Studio extends Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    sidebar: SidebarProps.isRequired,
    map: MapProps.isRequired,
    tours: ToursProps.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      activeTourStep: -1,
    };
  }

  handleChangeMapHeight = (newMapHeight) => {
    this.props.dispatch(changeMapHeight(newMapHeight));
  };

  handleChangeMapWidth = (newMapWidth) => {
    this.props.dispatch(changeMapWidth(newMapWidth));
  };

  handleChangeMapViewport = (newMapViewport) => {
    this.props.dispatch(changeMapViewport(newMapViewport));
  };

  handleToggleNewModal = () => {
    this.props.dispatch(toggleNewTourModal());
  };

  handleCreateNewTour = (tour) => {
    this.props.dispatch(createTour(tour));
    this.handleToggleNewModal();
  };

  handleCreateTourStep = (data) => {
    const getNewId = () => {
      if (this.props.tours.newTour.steps.length) {
        return this.props.tours.newTour.steps.slice(-1)[0].id + 1; // Slice returns an array!!
      }
      return 0;
    };
    // Consider width and height values here, could be an issue. They MUST be overridden in the
    // client app.
    const step = {
      id: getNewId(),
      name: data.name,
      text: data.text,
      viewport: {
        ...this.props.map.viewport,
        transitionDuration: data.transitionDuration,
        transitionEasing: d3.easeCubic,
        transitionEasingName: 'd3.easeCubic',
      },
    };
    switch (data.transitionInterpolator) {
      case 'FlyToInterpolator':
        step.viewport.transitionInterpolator = new FlyToInterpolator();
        step.viewport.transitionInterpolatorName = 'FlyToInterpolator';
        break;
      case 'LinearInterpolator':
        step.viewport.transitionInterpolator = new LinearInterpolator();
        step.viewport.transitionInterpolatorName = 'LinearInterpolator';
        break;
      default:
        step.viewport.transitionInterpolator = null;
        step.viewport.transitionInterpolatorName = 'None';
    }
    this.props.dispatch(createTourStep(step));
  };

  handleDeleteTourStep = (id) => {
    this.props.dispatch(deleteTourStep(id));
  };

  handleUpdateTourStep = (updates, prevStep, index) => {
    const step = {
      id: prevStep.id,
      name: updates.name,
      text: updates.text,
      viewport: {
        ...this.props.map.viewport,
        transitionDuration: updates.transitionDuration,
        transitionEasing: d3.easeCubic,
        transitionEasingName: 'd3.easeCubic',
      },
    };
    this.props.dispatch(updateTourStep(step, index));
  };

  handleChangeToStepViewport = (id, index) => {
    // Update the viewport
    const step = this.props.tours.newTour.steps.filter(elem =>
      elem.id === parseInt(id, 10))[0];
    this.handleChangeMapViewport(step.viewport);

    // Add the active class to the step being previewed
    const elements = document.getElementsByClassName('tour-step__wrapper');
    for (let i = 0; i < elements.length; i += 1) {
      elements[i].classList.remove('tour-step__active');
    }
    document.getElementById(`tour-step__wrapper-${id}`).classList.add('tour-step__active');

    // Set the active step in state
    this.setState({ activeTourStep: index });
  };

  render() {
    return (
      <>
        <FullscreenMap
          sidebar={this.props.sidebar}
          map={this.props.map}
          handleChangeMapWidth={this.handleChangeMapWidth}
          handleChangeMapHeight={this.handleChangeMapHeight}
          handleChangeMapViewport={this.handleChangeMapViewport}
        />
        <TourPanel
          tours={this.props.tours}
          createTourStep={this.handleCreateTourStep}
          deleteTourStep={this.handleDeleteTourStep}
          changeToStepViewport={this.handleChangeToStepViewport}
          updateTourStep={this.handleUpdateTourStep}
        />
        <NewTourModal
          toggleModal={this.handleToggleNewModal}
          tourModal={this.props.tours.newTourModal}
          tours={this.props.tours}
          createNewTour={this.handleCreateNewTour}
          className="modal-classname-temp"
        />
        <MapPopover
          activeStep={this.state.activeTourStep}
          newTour={this.props.tours.newTour}
        />
      </>
    );
  }
}

export default withRouter(connect(state => ({
  sidebar: state.sidebar,
  map: state.map,
  tours: state.tours,
}))(Studio));
