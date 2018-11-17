import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import {
  changeMapWidth,
  changeMapHeight,
  changeMapViewport,
} from '../../redux/actions/mapActions';
import { toggleNewTourModal } from '../../redux/actions/tourActions';
import { SidebarProps, MapProps, ToursProps } from '../../shared/prop-types/ReducerProps';
import FullscreenMap from './components/FullscreenMap';
import NewTourModal from './components/NewTourModal';
import TourPanel from './components/TourPanel';

class Studio extends Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    sidebar: SidebarProps.isRequired,
    map: MapProps.isRequired,
    tours: ToursProps.isRequired,
  };

  constructor() {
    super();
    this.handleChangeMapWidth = this.handleChangeMapWidth.bind(this);
    this.handleChangeMapHeight = this.handleChangeMapHeight.bind(this);
    this.handleChangeMapViewport = this.handleChangeMapViewport.bind(this);
    this.handleToggleNewModal = this.handleToggleNewModal.bind(this);
  }

  handleChangeMapHeight(newMapHeight) {
    this.props.dispatch(changeMapHeight(newMapHeight));
  }

  handleChangeMapWidth(newMapWidth) {
    this.props.dispatch(changeMapWidth(newMapWidth));
  }

  handleChangeMapViewport(newMapViewport) {
    this.props.dispatch(changeMapViewport(newMapViewport));
  }

  handleToggleNewModal() {
    this.props.dispatch(toggleNewTourModal());
  }

  render() {
    return (
      <div>
        <FullscreenMap
          sidebar={this.props.sidebar}
          map={this.props.map}
          handleChangeMapWidth={this.handleChangeMapWidth}
          handleChangeMapHeight={this.handleChangeMapHeight}
          handleChangeMapViewport={this.handleChangeMapViewport}
        />
        <NewTourModal
          toggleModal={this.handleToggleNewModal}
          tourModal={this.props.tours.newTourModal}
          tours={this.props.tours}
          className="modal-classname-temp"
        />
      </div>
    );
  }
}

export default withRouter(connect(state => ({
  sidebar: state.sidebar,
  map: state.map,
  tours: state.tours,
}))(Studio));
