import React, { PureComponent } from 'react';
import PropTypes from 'prop-types'; // eslint-disable-line
import { ToursProps } from '../../../shared/prop-types/ReducerProps';
import TourStep from './TourStep';
import NewTourStep from './NewTourStep';

class TourPanel extends PureComponent {
  static propTypes = {
    tours: ToursProps.isRequired,
    createTourStep: PropTypes.func.isRequired,
    changeToStepViewport: PropTypes.func.isRequired,
  };

  render() {
    const tourSteps = () => (
      // eslint-disable-next-line
      this.props.tours.newTour.steps.map(tourStep => <TourStep key={tourStep.id} tourStep={tourStep} changeToStepViewport={this.props.changeToStepViewport} />)
    );

    return (
      <div className="tour-panel__wrapper">
        <div className="tour-panel__content">
          <div>
            {this.props.tours.newTour.name}
          </div>
          {tourSteps()}
          <NewTourStep createTourStep={this.props.createTourStep} />
        </div>
      </div>
    );
  }
}

export default TourPanel;
