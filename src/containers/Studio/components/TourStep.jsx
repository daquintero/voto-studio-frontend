import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Collapse, Input, Label, FormGroup, Tooltip } from 'reactstrap';
import { TourProps } from '../../../shared/prop-types/ReducerProps';
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
        this.props.changeToStepViewport(this.props.tourStep.id, this.props.index);
      }
    }
  };
  render() {
    return (
      <div
        className="tour-step__wrapper"
        id={`tour-step__wrapper-${this.props.tourStep.id}`}
      >
        <i
          id={`preview-${this.props.tourStep.id}`}
          data-id={this.props.tourStep.id}
          className="fal fa-eye tour-step__preview"
          onClick={() => this.props.changeToStepViewport(this.props.tourStep.id, this.props.index)}
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
          <hr />
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
    );
  }
}

export default TourStep;
