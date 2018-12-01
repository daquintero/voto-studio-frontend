import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import ClassNames from 'classnames';
import { Draggable } from 'react-beautiful-dnd';
import { Collapse, Input, Label, FormGroup, Tooltip, Table, Nav, NavLink } from 'reactstrap';
import { TourProps } from '../../../../../shared/prop-types/ReducerProps';
import Loader from '../../../../../shared/components/Loader';

class TourStep extends Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    changeToStepViewport: PropTypes.func.isRequired,
    index: PropTypes.number.isRequired,
    tourStep: TourProps.isRequired,
    deleteTourStep: PropTypes.func.isRequired,
    toggleUpdatingTourStep: PropTypes.func.isRequired,
    updatingTourStep: PropTypes.bool.isRequired,
    updateTourStep: PropTypes.func.isRequired,
    activeTourStepId: PropTypes.number.isRequired,
    createMarker: PropTypes.func.isRequired,
  };
  constructor(props) {
    super(props);
    // I am using props in the constructor here only to set default values. The component
    // does NOT depend on changes in these props.
    this.state = {
      collapse: false,
      tooltip: false,
      updatingTourStep: false,
      name: this.props.tourStep.name,
      text: this.props.tourStep.text,
      transitionDuration: this.props.tourStep.viewport.transitionDuration,
      transitionInterpolatorName: this.props.tourStep.viewport.transitionInterpolatorName,
      transitionEasingName: this.props.tourStep.viewport.transitionInterpolatorName,
    };
  }

  onChange = (e) => {
    e.persist();
    if (e.target.name === 'transitionDuration') {
      this.setState({ [e.target.name]: parseInt(e.target.value, 10) });
      return;
    }
    this.setState({ [e.target.name]: e.target.value });
  };

  toggleTooltip = () => this.setState(prevState => ({ tooltip: !prevState.tooltip }));

  toggleCollapse = () => this.setState(prevState => ({ collapse: !prevState.collapse }));

  handleToggleUpdateTourStep = (savingTourStep) => {
    if (!this.props.updatingTourStep || savingTourStep) {
      if (this.state.updatingTourStep) {
        if (this.state.name && this.state.text && this.state.transitionDuration) {
          this.props.updateTourStep(this.state, this.props.tourStep, this.props.index);
          this.setState(prevState => ({ updatingTourStep: !prevState.updatingTourStep }));
          this.props.toggleUpdatingTourStep();
        }
      } else {
        this.setState(prevState => ({ updatingTourStep: !prevState.updatingTourStep }));
        this.props.toggleUpdatingTourStep();
        this.props.changeToStepViewport(this.props.tourStep.id);
      }
    }
  };

  render() {
    const {
      activeTourStepId, tours, tourStep, index, changeToStepViewport, createMarker, deleteTourStep,
    } = this.props;
    const loading = tours.actions.DELETE_TOUR_STEP[tourStep.id] ?
      tours.actions.DELETE_TOUR_STEP[tourStep.id].loading : false;
    const wrapperClasses = ClassNames({
      'tour-step__wrapper': true,
      'tour-step__wrapper__active': tourStep.id === activeTourStepId,
    });
    const deleteClasses = ClassNames({
      fal: true,
      'fa-trash-alt': true,
      'mr-2': true,
      'tour-step__delete__loading': loading,
    });
    return (
      <Draggable draggableId={this.props.tourStep.id.toString()} index={index}>
        {provided => (
          <>
            <div
              className={wrapperClasses}
              id={`tour-step__wrapper-${tourStep.id}`}
              ref={provided.innerRef}
              {...provided.draggableProps}
            >
              {tours.actions.UPDATE_TOUR_STEP[tourStep.id] && tours.actions.UPDATE_TOUR_STEP[tourStep.id].loading && (
                <Loader elemClass="panel__update" />
              )}
              <i
                className="fal fa-fw fa-arrows-v tour-step__drag"
                {...provided.dragHandleProps}
              />
              <i
                id={`preview-${tourStep.id}`}
                data-id={tourStep.id}
                className="fal fa-fw fa-eye tour-step__preview"
                onClick={() => changeToStepViewport(tourStep.id)}
                role="presentation"
              />
              <Tooltip
                placement="right"
                isOpen={this.state.tooltip}
                target={`preview-${tourStep.id}`}
                toggle={this.toggleTooltip}
              >
                Preview step {index + 1}
              </Tooltip>
              {this.state.updatingTourStep &&
              <>
                <h4>Editing step {index + 1}</h4>
                <hr />
              </>
              }
              {this.state.updatingTourStep ? (
                <>
                  <FormGroup>
                    <Label for="name">Step Name</Label>
                    <Input name="name" type="text" value={this.state.name} onChange={e => this.onChange(e)} />
                  </FormGroup>
                  <FormGroup>
                    <Label for="text">Text</Label>
                    <Input name="text" type="textarea" value={this.state.text} onChange={e => this.onChange(e)} />
                  </FormGroup>
                </>
              ) : (
                <>
                  <h4>Step {index + 1} | {tourStep.name}</h4>
                  <p><small>{tourStep.text}</small></p>
                </>
              )}
              <hr />
              {this.state.updatingTourStep && (
                <>
                  <FormGroup>
                    <Label for="transitionDuration">Transition Duration (ms)</Label>
                    <Input
                      name="transitionDuration"
                      type="number"
                      value={this.state.transitionDuration}
                      onChange={e => this.onChange(e)}
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label for="transitionInterpolatorName">Transition Interpolator</Label>
                    <Input
                      type="select"
                      name="transitionInterpolatorName"
                      id="transitionInterpolatorName"
                      onChange={e => this.onChange(e)}
                      value={this.state.transitionInterpolatorName}
                    >
                      <option>FlyToInterpolator</option>
                      <option>LinearInterpolator</option>
                    </Input>
                  </FormGroup>
                  <FormGroup>
                    <Label for="transitionEasingName">Transition Easing</Label>
                    <Input
                      type="select"
                      name="transitionEasingName"
                      id="transitionEasingName"
                      onChange={e => this.onChange(e)}
                      value={this.state.transitionEasingName}
                    >
                      <option>d3.cubicEasing</option>
                    </Input>
                  </FormGroup>
                </>
              )}
              <Collapse isOpen={this.state.collapse}>
                <p>Lat: {tourStep.viewport.latitude}</p>
                <p>Lng: {tourStep.viewport.longitude}</p>
                <p>Zoom: {tourStep.viewport.zoom}</p>
                <p>Pitch: {tourStep.viewport.pitch}</p>
                <p>Bearing: {tourStep.viewport.bearing}</p>
                <p>Transition Duration: {tourStep.viewport.transitionDuration}ms</p>
                <p>Transition Interpolator: {tourStep.viewport.transitionInterpolatorName}</p>
                <p>Transition Easing: {tourStep.viewport.transitionEasingName}</p>
                {tourStep.markers.length !== 0 ? (
                    <>
                      <div className="mt-3">
                        <h5 className="bold-text">Markers</h5>
                      </div>
                      <Table responsive hover>
                        <thead>
                          <tr>
                            <th>Name</th>
                            <th>Text</th>
                          </tr>
                        </thead>
                        <tbody>
                          {this.props.tourStep.markers.map(marker => (
                            <tr key={marker.id}>
                              <td>{marker.name}</td>
                              <td>{marker.text.substring(0, 20)}...</td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                      <hr />
                    </>
                ) : (
                  <hr />
                )}
                {tourStep.id === activeTourStepId && (
                  <span
                    className="tours-panel__new"
                    role="presentation"
                    onClick={() => createMarker(tourStep)}
                  >
                    <i className="fal fa-plus mr-2" />
                    Add new marker
                  </span>
                )}
              </Collapse>
              <div className="tour-step-controls__wrapper">
                <Nav>
                  <NavLink className="tour-step__control" onClick={this.toggleCollapse}>
                    {this.state.collapse ? (
                      <span><i className="fal fa-angle-up mr-2" />Less</span>
                    ) : (
                      <span><i className="fal fa-angle-down mr-2" />More</span>
                    )}
                  </NavLink>
                  {this.state.updatingTourStep ? (
                    <NavLink
                      className="tour-step__control"
                      onClick={() => this.handleToggleUpdateTourStep(true)}
                    >
                      <span><i className="fal fa-check mr-2" />Save</span>
                    </NavLink>
                  ) : (
                    <NavLink
                      className="tour-step__control"
                      onClick={() => this.handleToggleUpdateTourStep(true)}
                    >
                      <span><i className="fal fa-pen mr-2" />Edit</span>
                    </NavLink>
                  )}
                  <NavLink
                    className="tour-step__control"
                    onClick={() => deleteTourStep(tourStep.id)}
                  >
                    <span><i className={deleteClasses} />{loading ? 'Deleting' : 'Delete'}</span>
                  </NavLink>
                </Nav>
              </div>
            </div>
          </>
        )}
      </Draggable>
    );
  }
}

export default connect(state => ({
  tours: state.studio.tours,
  map: state.map,
}))(TourStep);
