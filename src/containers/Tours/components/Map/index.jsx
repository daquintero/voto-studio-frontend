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
} from '../../../../redux/actions/mapActions';
import {
  createTourStep,
  deleteTourStep,
  updateTourStep,
  reorderTourSteps,
  createMarker,
  updateMarker,
  deleteMarker,
} from '../../../../redux/actions/tourActions';
import { SidebarProps, MapProps, ToursProps } from '../../../../shared/prop-types/ReducerProps';
import FullscreenMap from './components/FullscreenMap';
import TourPanel from './components/TourPanel';
import MapPopover from './components/MapPopover';

class Map extends Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    sidebar: SidebarProps.isRequired,
    map: MapProps.isRequired,
    tours: ToursProps.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      activeTourStepId: -1,
      markers: [],
    };
  }

  getNewId = (arr) => {
    if (arr.length) {
      return Math.max(...arr.map(elem => elem.id), 0) + 1;
    }
    return 0;
  };

  getStepIndex = () => {
    const step = this.props.tours.newTour.steps.filter(elem => elem.id === this.state.activeTourStepId)[0];
    return this.props.tours.newTour.steps.indexOf(step);
  };

  handleChangeMapHeight = (newMapHeight) => {
    this.props.dispatch(changeMapHeight(newMapHeight));
  };

  handleChangeMapWidth = (newMapWidth) => {
    this.props.dispatch(changeMapWidth(newMapWidth));
  };

  handleChangeMapViewport = (newMapViewport) => {
    this.props.dispatch(changeMapViewport(newMapViewport));
  };

  addInterpolator(data, step) {  // eslint-disable-line
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
    return newStep;
  }

  handleCreateTourStep = (data) => {
    // Consider width and height values here, could be an issue. They MUST be overridden in the
    // client app.
    let step = {
      id: this.getNewId(this.props.tours.newTour.steps),
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
    this.setState({ activeTourStepId: step.id });
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
      markers: prevStep.markers,
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

    // Set the active step in state and set the markers
    // array in state to the markers of the active step
    this.setState({
      activeTourStepId: id,
      markers: step.markers,
    });
    console.log(step);
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

  handleCreateMarker = (step) => {
    const newMarker = {
      id: this.getNewId(step.markers),
      name: 'New marker',
      text: 'Edit me. Move me around. Do what you will...',
      longitude: this.props.map.viewport.longitude,
      latitude: this.props.map.viewport.latitude,
    };
    this.props.dispatch(createMarker(newMarker, step, this.getStepIndex()));
    // Send POST request to server with new marker
  };

  handleUpdateMarkerPosition = (e, marker) => {
    const newMarker = {
      ...marker,
      longitude: e.lngLat[0],
      latitude: e.lngLat[1],
    };
    const step = this.props.tours.newTour.steps.filter(elem => elem.id === this.state.activeTourStepId)[0];
    this.props.dispatch(updateMarker(newMarker, step, this.getStepIndex()));
    this.setState(prevState => ({
      ...prevState,
      markers: [
        ...prevState.markers,
      ],
    }));
    // Send POST request to server with new marker (or step?) instance
  };

  handleUpdateMarker = (marker, step) => {
    this.props.dispatch(updateMarker(marker, step, this.getStepIndex()));
    // Send PUT request to server with new marker (or step?) instance
  };

  handleDeleteMarker = (marker, step) => {
    this.props.dispatch(deleteMarker(marker, step, this.getStepIndex()));
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
          tours={this.props.tours}
          activeTourStepId={this.state.activeTourStepId}
          markers={this.state.markers}
          updateMarkerPosition={this.handleUpdateMarkerPosition}
          createMarker={this.handleCreateMarker}
          updateMarker={this.handleUpdateMarker}
          deleteMarker={this.handleDeleteMarker}
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
                activeTourStepId={this.state.activeTourStepId}
                createMarker={this.handleCreateMarker}
                innerRef={provided.innerRef}
                {...provided.droppableProps}
              >
                {provided.placeholder}
              </TourPanel>
            )}
          </Droppable>
        </DragDropContext>
        <MapPopover
          activeTourStepId={this.state.activeTourStepId}
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
}))(Map));
