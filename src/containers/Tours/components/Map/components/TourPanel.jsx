import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import { ToursProps } from '../../../../../shared/prop-types/ReducerProps';
import TourStep from './TourStep';
import NewTourStep from './NewTourStep';

class TourPanel extends Component {
  static propTypes = {
    tours: ToursProps.isRequired,
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
    const tourSteps = () => (
      this.props.tours.newTour.steps.map((tourStep, index) =>
        (
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
              {this.props.tours.newTour.name}{' - '}
              {this.props.tours.newTour.steps.length} step{this.props.tours.newTour.steps.length === 1 ? '' : 's'}
            </h3>
            <p>{this.props.tours.newTour.description}</p>
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
          {this.props.tours.newTour.name && (
            <NewTourStep createTourStep={this.props.createTourStep} />
          )}
        </div>
        <div
          style={{ float: 'left', clear: 'both' }}
          ref={(el) => { this.toursEnd = el; }}
        />
      </div>
    );
  }
}

export default TourPanel;
