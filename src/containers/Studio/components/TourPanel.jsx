import React, { PureComponent } from 'react';
import PropTypes from 'prop-types'; // eslint-disable-line
import { ToursProps } from '../../../shared/prop-types/ReducerProps';

class TourPanel extends PureComponent {
  static propTypes = {
    tours: ToursProps.isRequired,
  };
  render() {
    return (
      <div className="tour-panel__wrapper">{this.props.tours.newTourModal}</div>
    );
  }
}

export default TourPanel;
