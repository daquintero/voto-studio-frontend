import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Form, FormGroup, Input, Label, Button } from 'reactstrap';
// Add a help link to the interpolation and easing fields

class NewTourStep extends Component {
  static propTypes = {
    createTourStep: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      name: '',
      text: '',
      transitionDuration: '2000',
      transitionEasingName: 'd3.easeCubic',
      transitionInterpolatorName: 'FlyToInterpolator',
      formErrors: {
        name: false,
        text: false,
      },
    };
  }

  onChange = (e) => {
    e.persist();
    this.setState({ [e.target.name]: e.target.value });
  };

  onSubmit = () => {
    if (!this.state.name) this.setState(prevState => ({ formErrors: { ...prevState.formErrors, name: true } }));
    if (!this.state.text) this.setState(prevState => ({ formErrors: { ...prevState.formErrors, text: true } }));
    if (!this.state.name || !this.state.text) return;
    this.props.createTourStep(this.state);
    this.setState({
      name: '',
      text: '',
      transitionDuration: '2000',
      transitionEasing: 'd3.easeCubic',
      transitionInterpolator: 'FlyToInterpolator',
      formErrors: {
        name: false,
        text: false,
      },
    });
  };

  render() {
    const { formErrors } = this.state;
    // Add the option to hide and show the new step block
    return (
      <div className="new-tour-step__wrapper">
        <h4>New Step</h4>
        <hr />
        <div>
          <Form>
            <FormGroup>
              <Label for="name">Step Name
                {formErrors.name && (
                  <span className="new-tour-step__warning-label ml-2">&lt;This field is required&gt;</span>
                )}
              </Label>
              <Input
                type="text"
                name="name"
                id="name"
                onChange={e => this.onChange(e)}
                value={this.state.name}
              />
            </FormGroup>
            <FormGroup>
              <Label for="name">Text
                {formErrors.text && (
                  <span className="new-tour-step__warning-label ml-2">&lt;This field is required&gt;</span>
                )}
              </Label>
              <Input
                type="textarea"
                name="text"
                id="text"
                onChange={e => this.onChange(e)}
                value={this.state.text}
              />
            </FormGroup>
            <FormGroup>
              <Label for="transitionDuration">Transition Duration (ms)</Label>
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
                <option>d3.easeCubic</option>
              </Input>
            </FormGroup>
          </Form>
          <Button style={{ width: '100%' }} onClick={this.onSubmit} >Add</Button>
        </div>
      </div>
    );
  }
}

export default NewTourStep;
