import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Form, FormGroup, Input, Label, Button } from 'reactstrap';

class NewTourStepControls extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      text: '',
      transitionInterpolator: 'FlyToInterpolator',
      transitionDuration: '',
      transitionEasing: 'd3.cubicEasing',
    };
    this.onChange = this.onChange.bind(this);
    this.testOnClick = this.testOnClick.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }
  onChange(e) {
    e.persist();
    this.setState({ [e.target.name]: e.target.value });
  }
  onSubmit() {
    this.props.createTourStep(this.state);
    this.setState({
      name: '',
      text: '',
      transitionInterpolator: 'FlyToInterpolator',
      transitionDuration: '',
      transitionEasing: 'd3.cubicEasing',
    });
  }
  testOnClick() {
    console.log('This works', this.state.name);
  }
  handleKeyPress() {
    console.log('keypress', this.state.name);
  }
  render() {
    return (
      // Add a help link to the interpolation and easing fields
      <div>
        <Form>
          <FormGroup>
            <Label for="name">Step Name</Label>
            <Input
              type="text"
              name="name"
              id="name"
              onChange={e => this.onChange(e)}
              value={this.state.name}
            />
          </FormGroup>
          <FormGroup>
            <Label for="text">Text</Label>
            <Input
              type="textarea"
              name="text"
              id="text"
              onChange={e => this.onChange(e)}
              value={this.state.text}
            />
          </FormGroup>
          <FormGroup>
            <Label for="transitionDuration">Transition Duration</Label>
            <Input
              type="number"
              name="transitionDuration"
              id="transitionDuration"
              onChange={e => this.onChange(e)}
              value={this.state.transitionDuration}
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
        </Form>
        <Button style={{ width: '100%' }} onClick={this.onSubmit} >Add</Button>
      </div>
    );
  }
}

NewTourStepControls.propTypes = {
  createTourStep: PropTypes.func.isRequired,
};

export default NewTourStepControls;