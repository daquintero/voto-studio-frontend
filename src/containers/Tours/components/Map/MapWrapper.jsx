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
    if (!this.props.tours.openTour.loading && !this.props.tours.openTour.loaded) {
      this.props.dispatch(getTourDetail(this.props.match.params.tourId));
    }
  }
  render() {
    console.log(this.props);
    return <Map loading={this.props.tours.openTour.loading} loaded={this.props.tours.openTour.loaded} />;
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
