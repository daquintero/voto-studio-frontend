import React from 'react';
import PropTypes from 'prop-types';
import { ToursProps } from '../../../shared/prop-types/ReducerProps';

const MapPopover = props => (
  <>
    {props.activeStep !== -1 &&
      <div className="map-popover__wrapper">
        Step {props.activeStep + 1} out of {props.newTour.steps.length}
      </div>
    }
  </>
);

MapPopover.propTypes = {
  activeStep: PropTypes.isRequired,
  newTour: ToursProps.isRequired,
};

export default MapPopover;
