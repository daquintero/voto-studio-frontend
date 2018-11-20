import React from 'react';
import PropTypes from 'prop-types';
import NewTourStepControls from './NewTourStepControls';

const NewTourStep = props => (
  <div className="new-tour-step__wrapper">
    <NewTourStepControls createTourStep={props.createTourStep} />
  </div>
);

NewTourStep.propTypes = {
  createTourStep: PropTypes.func.isRequired,
};

export default NewTourStep;
