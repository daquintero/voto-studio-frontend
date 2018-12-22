import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import classnames from 'classnames';
import { Button, ButtonToolbar } from 'reactstrap';
import { ToursProps, MapProps, SidebarProps } from '../../../../../shared/prop-types/ReducerProps';
import TourStep from './TourStep';
import NewTourStep from './NewTourStep';
import {
  updateTourStep,
  deleteTourStep,
  createTourStep,
  reorderTourSteps,
  togglePreviewTourMode,
} from '../../../../../redux/actions/tourActions';
// import addTransitionClasses from '../../../../../shared/utils/addTransitionClasses';
import Loader from '../../../../../shared/components/Loader';
import { changeMapWidth } from '../../../../../redux/actions/mapActions';

class TourPanel extends Component {
  static propTypes = {
    tours: ToursProps.isRequired,
    map: MapProps.isRequired,
    changeToStepViewport: PropTypes.func.isRequired,
    dispatch: PropTypes.func.isRequired,
    sidebar: SidebarProps.isRequired,
    publishTourModal: PropTypes.bool.isRequired,
    togglePublishTourModal: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      updatingTourStep: false,
    };
  }

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
    };
    delete step.viewport.transitionInterpolator;
    delete step.viewport.transitionInterruption;
    delete step.viewport.width;
    delete step.viewport.height;
    delete step.markers;
    this.props.dispatch(createTourStep(step, this.props.tours.openTour.id));
  };

  handleToggleUpdatingTourStep = () => {
    this.setState(prevState => ({ updatingTourStep: !prevState.updatingTourStep }));
  };

  handleUpdateTourStep = (updates, prevStep, index) => {
    const step = {
      id: prevStep.id,
      name: updates.name,
      text: updates.text,
      viewport: {
        ...this.props.map.viewport,
        transitionDuration: updates.transitionDuration,
        transitionInterpolatorName: updates.transitionInterpolatorName,
        transitionEasingName: 'd3.easeCubic',
      },
    };
    delete step.viewport.transitionInterpolator;
    delete step.viewport.transitionInterruption;
    delete step.viewport.width;
    delete step.viewport.height;
    delete step.markers;
    // step = addTransitionClasses(step);
    this.props.dispatch(updateTourStep(step, index));
  };

  handleDeleteTourStep = id => this.props.dispatch(deleteTourStep(id, this.props.tours.openTour.id));

  handleOnDragEnd = (result) => {
    const { destination, source } = result;
    if (!destination) {
      return;
    }
    if (destination.index === source.index) {
      return;
    }
    this.props.dispatch(reorderTourSteps(this.props.tours.openTour.id, result));
  };

  handleTogglePreviewTourMode = () => {
    const {
      sidebar, dispatch, tours,
    } = this.props;
    dispatch(togglePreviewTourMode());
    const sidebarWidth = sidebar.collapse ? 55 : 240;
    const tourPanelWidth = !tours.previewTourMode ? 0 : 300;
    dispatch(changeMapWidth(window.innerWidth - (sidebarWidth + tourPanelWidth)));
  };

  render() {
    const { tours, togglePublishTourModal } = this.props;
    const tour = tours.openTour;
    const tourSteps = () => (
      tour.steps.map((tourStep, index) => (
        <TourStep
          key={tourStep.id}
          index={index}
          tourStep={tourStep}
          changeToStepViewport={this.props.changeToStepViewport}
          deleteTourStep={this.handleDeleteTourStep}
          updatingTourStep={this.state.updatingTourStep}
          toggleUpdatingTourStep={this.handleToggleUpdatingTourStep}
          updateTourStep={this.handleUpdateTourStep}
          activeTourStepId={tours.openTour.activeTourStepId}
          createMarker={this.props.createMarker}
        />
      )));
    const wrapperClasses = classnames({
      'tour-panel__wrapper': true,
      'tour-panel__wrapper__hide': tours.previewTourMode,
    });
    return (
      <div className={wrapperClasses} id="tour-panel__wrapper">
        <div className="tour-panel__content">
          <div className="tour-panel__name__wrapper">
            <h3>
              {tour.name}
            </h3>
            <p>{tour.description}</p>
            <ButtonToolbar>
              <Button className="tour-panel__tour-preview" onClick={this.handleTogglePreviewTourMode}>
                <i className="fal fa-fw fa-eye" /> Preview Mode
              </Button>
              <Button
                className="tour-panel__tour-preview"
                color="success"
                onClick={togglePublishTourModal}
              >
                <i className="fal fa-fw fa-globe-americas" /> Publish
              </Button>
            </ButtonToolbar>
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
          {tours.actions.CREATE_TOUR_STEP.loading && (
            <Loader elemClass="load__panel" />
          )}
          {tours.actions.CREATE_TOUR_STEP.error && (
            <p>{tours.actions.CREATE_TOUR_STEP.error.message}</p>
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
  sidebar: state.sidebar,
}))(TourPanel);
