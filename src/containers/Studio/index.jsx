import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { FlyToInterpolator, LinearInterpolator } from 'deck.gl';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
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
  reorderTourSteps,
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
      activeTourStepIndex: -1,
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
    // Send POST request to server with new tour
  };

  addInterpolator(data, step) {
    const newStep = step;
    switch (data.transitionInterpolator) {
      case 'FlyToInterpolator':
        newStep.viewport.transitionInterpolator = new FlyToInterpolator();
        newStep.viewport.transitionInterpolatorName = 'FlyToInterpolator';
        break;
      case 'LinearInterpolator':
        newStep.viewport.transitionInterpolator = new LinearInterpolator();
        newStep.viewport.transitionInterpolatorName = 'LinearInterpolator';
        break;
      default:
        newStep.viewport.transitionInterpolator = null;
        newStep.viewport.transitionInterpolatorName = 'None';
    }
    let hi = 4;
    if (this && hi === 4) hi = 4;
    return newStep;
  }

  handleCreateTourStep = (data) => {
    const getNewId = () => {
      if (this.props.tours.newTour.steps.length) {
        return this.props.tours.newTour.steps.slice(-1)[0].id + 1; // Slice returns an array!!
      }
      return 0;
    };
    // Consider width and height values here, could be an issue. They MUST be overridden in the
    // client app.
    let step = {
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
    step = this.addInterpolator(data, step);

    this.props.dispatch(createTourStep(step));
    // Send POST request to server with new step
  };

  handleDeleteTourStep = (id) => {
    this.props.dispatch(deleteTourStep(id));
    // Send DELETE request to server
  };

  handleUpdateTourStep = (updates, prevStep, index) => {
    let step = {
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
    step = this.addInterpolator(updates, step);
    this.props.dispatch(updateTourStep(step, index));
    // Send PUT request to server with updated step
  };

  handleChangeToStepViewport = (id) => {
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
    this.setState({ activeTourStepIndex: id });
  };

  handleOnDragEnd = (result) => {
    // Update state
    const { destination, source, draggableId } = result;
    const step = this.props.tours.newTour.steps.filter(elem => elem.id === parseInt(draggableId, 10))[0];
    if (!destination) {
      return;
    }
    if (destination.index === source.index) {
      return;
    }
    this.props.dispatch(reorderTourSteps(step, result));
    // Send PUT request to server to update order
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
        <DragDropContext onDragEnd={this.handleOnDragEnd}>
          <Droppable droppableId="tour-panel">
            {provided => (
              <TourPanel
                tours={this.props.tours}
                createTourStep={this.handleCreateTourStep}
                deleteTourStep={this.handleDeleteTourStep}
                changeToStepViewport={this.handleChangeToStepViewport}
                updateTourStep={this.handleUpdateTourStep}
                innerRef={provided.innerRef}
                {...provided.droppableProps}
              >
                {provided.placeholder}
              </TourPanel>
            )}
          </Droppable>
        </DragDropContext>
        <NewTourModal
          toggleModal={this.handleToggleNewModal}
          tourModal={this.props.tours.newTourModal}
          tours={this.props.tours}
          createNewTour={this.handleCreateNewTour}
          className="modal-classname-temp"
        />
        <MapPopover
          activeTourStepIndex={this.state.activeTourStepIndex}
          newTour={this.props.tours.newTour}
          changeToStepViewport={this.handleChangeToStepViewport}
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
