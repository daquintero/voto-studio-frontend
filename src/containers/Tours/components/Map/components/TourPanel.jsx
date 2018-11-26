import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import { TourProps } from '../../../../../shared/prop-types/ReducerProps';
import TourStep from './TourStep';
import NewTourStep from './NewTourStep';
import asyncLoading from '../../../../../shared/components/asyncLoading';

class TourPanel extends Component {
  static propTypes = {
    openTour: TourProps.isRequired,
    createTourStep: PropTypes.func.isRequired,
    changeToStepViewport: PropTypes.func.isRequired,
    deleteTourStep: PropTypes.func.isRequired,
    updateTourStep: PropTypes.func.isRequired,
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

  render() {
    const tour = this.props.openTour;
    const tourSteps = () => (
      tour.steps.map((tourStep, index) => (
        <TourStep
          key={tourStep.id}
          index={index}
          tourStep={tourStep}
          changeToStepViewport={this.props.changeToStepViewport}
          deleteTourStep={this.props.deleteTourStep}
          updatingTourStep={this.state.updatingTourStep}
          toggleUpdatingTourStep={this.handleToggleUpdatingTourStep}
          updateTourStep={this.props.updateTourStep}
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

export default asyncLoading(true)(TourPanel);
