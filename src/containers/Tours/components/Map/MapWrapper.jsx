import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { ToursProps } from '../../../../shared/prop-types/ReducerProps';
import Map from './index';
import { getTourDetail } from '../../../../redux/actions/tourActions';

class MapWrapper extends PureComponent {
  static propTypes = {
    tours: ToursProps.isRequired,
    dispatch: PropTypes.func.isRequired,
    match: ReactRouterPropTypes.match.isRequired,
  };

  componentDidMount() {
    // If the tour to be opened matches the id of the open tour then do nothing
    // If this is not the case then load the new tour data
    const { tours } = this.props;
    if (tours.actions.OPEN_TOUR.init) this.props.dispatch(getTourDetail(this.props.match.params.tourId));
  }

  render() {
    return (
      <Map action={this.props.tours.actions.OPEN_TOUR} />
    );
  }
}

export default withRouter(connect(state => ({
  tours: state.studio.tours,
}))(MapWrapper));
