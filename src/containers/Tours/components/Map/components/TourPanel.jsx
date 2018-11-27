import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import { TourProps, ToursProps, MapProps } from '../../../../../shared/prop-types/ReducerProps';
import TourStep from './TourStep';
import NewTourStep from './NewTourStep';
import { updateTourStep } from '../../../../../redux/actions/tourActions';
import addTransitionClasses from '../../../../../shared/utils/addTransitionClasses';

class TourPanel extends Component {
  static propTypes = {
    openTour: TourProps.isRequired,
    tours: ToursProps.isRequired,
    maps: MapProps.isRequired,
    createTourStep: PropTypes.func.isRequired,
    changeToStepViewport: PropTypes.func.isRequired,
    deleteTourStep: PropTypes.func.isRequired,
    activeTourStepId: PropTypes.number.isRequired,
    createMarker: PropTypes.func.isRequired,
    onDragEnd: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      updatingTourStep: false,
    };
  }

  componentDidUpdate() {
    // this.scrollToBottom();
  }

  scrollToBottom() {
    this.toursEnd.scrollIntoView({ behavior: 'smooth' });
  }

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

  render() {
    const tour = this.props.openTour;
    const tourSteps = () => (
      tour.steps.map((tourStep, index) => (
        <TourStep
          loading={tourStep.loading}
          loaded={tourStep.loaded}
          key={tourStep.id}
          index={index}
          tourStep={tourStep}
          changeToStepViewport={this.props.changeToStepViewport}
          deleteTourStep={this.props.deleteTourStep}
          updatingTourStep={this.state.updatingTourStep}
          toggleUpdatingTourStep={this.handleToggleUpdatingTourStep}
          updateTourStep={this.handleUpdateTourStep}
          activeTourStepId={this.props.activeTourStepId}
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
          <DragDropContext onDragEnd={this.props.onDragEnd}>
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
          <NewTourStep createTourStep={this.props.createTourStep} />
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
  maps: state.maps,
}))(TourPanel);
