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
} from '../../redux/actions/tourActions';
import { SidebarProps, MapProps, ToursProps } from '../../shared/prop-types/ReducerProps';
import FullscreenMap from './components/FullscreenMap';
import NewTourModal from './components/NewTourModal';
import TourPanel from './components/TourPanel';

class Studio extends Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    sidebar: SidebarProps.isRequired,
    map: MapProps.isRequired,
    tours: ToursProps.isRequired,
  };

  constructor() {
    super();
    this.handleChangeMapWidth = this.handleChangeMapWidth.bind(this);
    this.handleChangeMapHeight = this.handleChangeMapHeight.bind(this);
    this.handleChangeMapViewport = this.handleChangeMapViewport.bind(this);
    this.handleToggleNewModal = this.handleToggleNewModal.bind(this);
    this.handleCreateNewTour = this.handleCreateNewTour.bind(this);
    this.handleCreateTourStep = this.handleCreateTourStep.bind(this);
    this.handleChangeToStepViewport = this.handleChangeToStepViewport.bind(this);
  }

  handleChangeMapHeight(newMapHeight) {
    this.props.dispatch(changeMapHeight(newMapHeight));
  }

  handleChangeMapWidth(newMapWidth) {
    this.props.dispatch(changeMapWidth(newMapWidth));
  }

  handleChangeMapViewport(newMapViewport) {
    this.props.dispatch(changeMapViewport(newMapViewport));
  }

  handleToggleNewModal() {
    this.props.dispatch(toggleNewTourModal());
  }

  handleCreateNewTour(tour) {
    this.props.dispatch(createTour(tour));
  }

  handleCreateTourStep(data) {
    const getNewId = () => {
      if (this.props.tours.newTour.steps.length) {
        return this.props.tours.newTour.steps.slice(-1)[0].id + 1; // Slice returns an array!!
      }
      return 1;
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
  }

  handleChangeToStepViewport(e) {
    e.persist();
    const step = this.props.tours.newTour.steps.filter(elem =>
      elem.id === parseInt(e.currentTarget.getAttribute('id'), 10))[0];
    this.handleChangeMapViewport(step.viewport);
  }

  render() {
    return (
      <div>
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
          changeToStepViewport={this.handleChangeToStepViewport}
        />
        <NewTourModal
          toggleModal={this.handleToggleNewModal}
          tourModal={this.props.tours.newTourModal}
          tours={this.props.tours}
          createNewTour={this.handleCreateNewTour}
          className="modal-classname-temp"
        />
      </div>
    );
  }
}

export default withRouter(connect(state => ({
  sidebar: state.sidebar,
  map: state.map,
  tours: state.tours,
}))(Studio));
