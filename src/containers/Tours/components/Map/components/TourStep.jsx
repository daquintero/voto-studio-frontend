import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ClassNames from 'classnames';
import { Draggable } from 'react-beautiful-dnd';
import { Collapse, Input, Label, FormGroup, Tooltip, Table } from 'reactstrap';
import { TourProps } from '../../../../../shared/prop-types/ReducerProps';
import TourStepControls from './TourStepControls';

class TourStep extends Component {
  static propTypes = {
    index: PropTypes.number.isRequired,
    tourStep: TourProps.isRequired,
    changeToStepViewport: PropTypes.func.isRequired,
    deleteTourStep: PropTypes.func.isRequired,
    toggleUpdatingTourStep: PropTypes.func.isRequired,
    updatingTourStep: PropTypes.bool.isRequired,
    updateTourStep: PropTypes.func.isRequired,
    activeTourStepId: PropTypes.number.isRequired,
    createMarker: PropTypes.func.isRequired,
  };
  constructor(props) {
    super(props);
    this.state = {
      collapse: false,
      tooltip: false,
      updatingTourStep: false,
      name: this.props.tourStep.name,
      text: this.props.tourStep.text,
      transitionDuration: this.props.tourStep.viewport.transitionDuration,
      transitionInterpolator: this.props.tourStep.viewport.transitionInterpolatorName,
      transitionEasing: this.props.tourStep.viewport.transitionInterpolatorName,
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
  toggleTooltip = () => {
    this.setState(prevState => ({ tooltip: !prevState.tooltip }));
  };
  toggleCollapse = () => {
    this.setState(prevState => ({ collapse: !prevState.collapse }));
  };
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
    const wrapperClasses = ClassNames({
      'tour-step__wrapper': true,
      'tour-step__wrapper__active': this.props.tourStep.id === this.props.activeTourStepId,
    });
    return (
      <Draggable draggableId={this.props.tourStep.id.toString()} index={this.props.index}>
        {provided => (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            className={wrapperClasses}
            id={`tour-step__wrapper-${this.props.tourStep.id}`}
          >
            <i
              className="fal fa-fw fa-arrows-v tour-step__drag"
              {...provided.dragHandleProps}
            />
            <i
              id={`preview-${this.props.tourStep.id}`}
              data-id={this.props.tourStep.id}
              className="fal fa-fw fa-eye tour-step__preview"
              onClick={() => this.props.changeToStepViewport(this.props.tourStep.id)}
              role="presentation"
            />
            <Tooltip
              placement="right"
              isOpen={this.state.tooltip}
              target={`preview-${this.props.tourStep.id}`}
              toggle={this.toggleTooltip}
            >
              Preview step {this.props.index + 1}
            </Tooltip>
            {this.state.updatingTourStep &&
            <>
              <h4>Editing step {this.props.index + 1}</h4>
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
                <h4>Step {this.props.index + 1} | {this.props.tourStep.name}</h4>
                <p><small>{this.props.tourStep.text}</small></p>
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
                  <Label for="transitionInterpolator">Transition Interpolator</Label>
                  <Input
                    type="select"
                    name="transitionInterpolator"
                    id="transitionInterpolator"
                    onChange={e => this.onChange(e)}
                    value={this.state.transitionInterpolator}
                  >
                    <option>FlyToInterpolator</option>
                    <option>LinearInterpolator</option>
                  </Input>
                </FormGroup>
                <FormGroup>
                  <Label for="transitionInterpolator">Transition Easing</Label>
                  <Input
                    type="select"
                    name="transitionEasing"
                    id="transitionEasing"
                    onChange={e => this.onChange(e)}
                    value={this.state.transitionEasing}
                  >
                    <option>d3.cubicEasing</option>
                  </Input>
                </FormGroup>
              </>
            )}
            <Collapse isOpen={this.state.collapse}>
              <p>Lat: {this.props.tourStep.viewport.latitude}</p>
              <p>Lng: {this.props.tourStep.viewport.longitude}</p>
              <p>Zoom: {this.props.tourStep.viewport.zoom}</p>
              <p>Pitch: {this.props.tourStep.viewport.pitch}</p>
              <p>Bearing: {this.props.tourStep.viewport.bearing}</p>
              <p>Transition Duration: {this.props.tourStep.viewport.transitionDuration}ms</p>
              <p>Transition Interpolator: {this.props.tourStep.viewport.transitionInterpolatorName}</p>
              <p>Transition Easing: {this.props.tourStep.viewport.transitionEasingName}</p>
              {this.props.tourStep.markers.length !== 0 ? (
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
                    <span
                      className="tours-panel__new"
                      role="presentation"
                      onClick={() => this.props.createMarker(this.props.tourStep)}
                    >
                      <i className="fal fa-plus mr-2" />
                      Add new marker
                    </span>
                    <hr />
                  </>
              ) : (
                <hr />
              )}
            </Collapse>
            <TourStepControls
              collapse={this.state.collapse}
              toggleCollapse={this.toggleCollapse}
              deleteTourStep={this.props.deleteTourStep}
              deleteTourStepId={this.props.tourStep.id}
              toggleUpdateTourStep={this.handleToggleUpdateTourStep}
              updatingTourStep={this.state.updatingTourStep}
              updateTourStep={this.props.updateTourStep}
            />
          </div>
        )}
      </Draggable>
    );
  }
}

export default TourStep;
