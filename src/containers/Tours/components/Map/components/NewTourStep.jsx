import React from 'react';
import PropTypes from 'prop-types';
import NewTourStepControls from './NewTourStepControls';

const NewTourStep = props => (
  // Add the option to hide and show the new step block
  <div className="new-tour-step__wrapper">
    <h4>New Step</h4>
    <hr />
    <NewTourStepControls createTourStep={props.createTourStep} />
  </div>
);

NewTourStep.propTypes = {
  createTourStep: PropTypes.func.isRequired,
};

export default NewTourStep;
