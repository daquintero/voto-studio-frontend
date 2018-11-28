import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { ToursProps } from '../../../../shared/prop-types/ReducerProps';
import Map from './index';
import { getTourDetail } from '../../../../redux/actions/tourActions';

class MapWrapper extends PureComponent {
  componentDidMount() {
    const { openTour } = this.props.tours;
    if (!openTour.actionStatus || (!openTour.actionStatus.loading && !openTour.actionStatus.loaded)) {
      this.props.dispatch(getTourDetail(this.props.match.params.tourId));
    }
  }
  render() {
    return (
      <Map
        action={this.props.tours.openTour.actionStatus}
        actions={['OPEN_TOUR']}
      />
    );
  }
}

MapWrapper.propTypes = {
  tours: ToursProps.isRequired,
  dispatch: PropTypes.func.isRequired,
  match: ReactRouterPropTypes.match.isRequired,
};

export default withRouter(connect(state => ({
  tours: state.studio.tours,
}))(MapWrapper));
