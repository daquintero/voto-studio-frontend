import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { ToursProps, SidebarProps } from '../../../../shared/prop-types/ReducerProps';
import Map from './index';
import { getTourDetail } from '../../../../redux/actions/tourActions';
import { changeMapViewport } from '../../../../redux/actions/mapActions';
import { changeSidebarVisibility } from '../../../../redux/actions/sidebarActions';
import addTransitionClasses from '../../../../shared/utils/addTransitionClasses';

class MapWrapper extends PureComponent {
  static propTypes = {
    tours: ToursProps.isRequired,
    dispatch: PropTypes.func.isRequired,
    match: ReactRouterPropTypes.match.isRequired,
    sidebar: SidebarProps.isRequired,
  };

  componentDidMount() {
    // If the tour to be opened matches the id of the open tour then do nothing
    // If this is not the case then load the new tour data
    const {
      tours, match, dispatch, sidebar,
    } = this.props;
    if (tours.actions.OPEN_TOUR.init && tours.openTour.id !== parseInt(match.params.tourId, 10)) {
      dispatch(getTourDetail(match.params.tourId))
        .then((response) => {
          if (response.type === 'OPEN_TOUR_SUCCESS') {
            const { tour } = response;
            if (tour.steps.length) {
              dispatch(changeMapViewport(addTransitionClasses(tour.steps[0]).viewport));
            }
            if (!sidebar.collapse) dispatch(changeSidebarVisibility());
          }
        });
    }
  }

  render() {
    const { tours, match } = this.props;
    return (
      <Map
        action={this.props.tours.actions.OPEN_TOUR}
        preloaded={tours.openTour.id === parseInt(match.params.tourId, 10)}
      />
    );
  }
}

export default withRouter(connect(state => ({
  tours: state.studio.tours,
  sidebar: state.sidebar,
}))(MapWrapper));
