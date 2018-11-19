import React from 'react';
import PropTypes from 'prop-types';

const MapPopover = props => (
  <div className="map-popover__wrapper">
    <h1>{props.tours.newTour.tourStep.name}</h1>
    <p>{props.tous.newTour.tourStep.text}</p>
  </div>
);

MapPopover.propTypes({

});

export default MapPopover;
