// Absolute Imports
import React from 'react';

import LocationPicker from './components/LocationPicker';

const renderLocationPickerField = props => (
  <LocationPicker
    {...props.input}
  />
);

export default renderLocationPickerField;
