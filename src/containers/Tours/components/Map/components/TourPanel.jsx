import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import { ToursProps, MapProps } from '../../../../../shared/prop-types/ReducerProps';
import TourStep from './TourStep';
import NewTourStep from './NewTourStep';
import {
  updateTourStep,
  deleteTourStep,
  createTourStep,
  reorderTourSteps,
} from '../../../../../redux/actions/tourActions';
import addTransitionClasses from '../../../../../shared/utils/addTransitionClasses';
import Loader from '../../../../../shared/components/Loader';

class TourPanel extends Component {
  static propTypes = {
    tours: ToursProps.isRequired,
    map: MapProps.isRequired,
    changeToStepViewport: PropTypes.func.isRequired,
    createMarker: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      updatingTourStep: false,
    };
  }

  // Thinking about moving this to a utils folder in shared
  getStep = stepId => this.props.tours.openTour.steps.filter(elem => elem.id === parseInt(stepId, 10))[0];

  handleCreateTourStep = (data) => {
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
    delete step.viewport.width;
    delete step.viewport.height;
    this.props.dispatch(createTourStep(step, this.props.tours.openTour.id));
  };

  handleToggleUpdatingTourStep = () => {
    this.setState(prevState => ({ updatingTourStep: !prevState.updatingTourStep }));
  };

  handleUpdateTourStep = (updates, prevStep, index) => {
    let step = {
      id: prevStep.id,
      name: updates.name,
      text: updates.text,
      viewport: {
        ...this.props.map.viewport,
        transitionDuration: updates.transitionDuration,
        transitionInterpolatorName: updates.transitionInterpolatorName,
        transitionEasingName: 'd3.easeCubic',
      },
      markers: prevStep.markers,
    };
    step = addTransitionClasses(step);
    this.props.dispatch(updateTourStep(step, index));
  };

  handleDeleteTourStep = id => this.props.dispatch(deleteTourStep(id));

  handleOnDragEnd = (result) => {
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

  render() {
    const tour = this.props.tours.openTour;
    const tourSteps = () => (
      tour.steps.map((tourStep, index) => (
        <TourStep
          preloaded
          key={tourStep.id}
          index={index}
          tourStep={tourStep}
          changeToStepViewport={this.props.changeToStepViewport}
          deleteTourStep={this.handleDeleteTourStep}
          updatingTourStep={this.state.updatingTourStep}
          toggleUpdatingTourStep={this.handleToggleUpdatingTourStep}
          updateTourStep={this.handleUpdateTourStep}
          activeTourStepId={this.props.tours.openTour.activeTourStepId}
          createMarker={this.props.createMarker}
        />
      )));
    return (
      <div className="tour-panel__wrapper" id="tour-panel__wrapper">
        <div className="tour-panel__content">
          <div className="tour-panel__name__wrapper">
            <h3>
              {tour.name}{' - '}
              {tour.steps.length} step{tour.steps.length === 1 ? '' : 's'}
            </h3>
            <p>{tour.description}</p>
          </div>
          <DragDropContext onDragEnd={this.handleOnDragEnd}>
            <Droppable droppableId="tour-panel">
              {provided => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                >
                  {tourSteps()}
                  {provided.placeholder}
                </div>
                )}
            </Droppable>
          </DragDropContext>
          {this.props.tours.actions.CREATE_TOUR_STEP.loading && (
            <Loader elemType="panel" />
          )}
          {this.props.tours.actions.CREATE_TOUR_STEP.error && (
            <p>{this.props.tours.actions.CREATE_TOUR_STEP.error.message}</p>
          )}
          <NewTourStep createTourStep={this.handleCreateTourStep} />
        </div>
        <div
          style={{ float: 'left', clear: 'both' }}
          ref={(el) => { this.toursEnd = el; }}
        />
      </div>
    );
  }
}

export default connect(state => ({
  tours: state.studio.tours,
  map: state.map,
}))(TourPanel);
