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
    const { tours } = this.props;
    if (tours.actions.OPEN_TOUR.init ||
      (!tours.actions.OPEN_TOUR.loading && !tours.actions.OPEN_TOUR.loaded)) {
      this.props.dispatch(getTourDetail(this.props.match.params.tourId));
    }
  }
  render() {
    return (
      <Map action={this.props.tours.actions.OPEN_TOUR} />
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
