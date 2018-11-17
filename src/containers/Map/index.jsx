import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import FullscreenMap from '../Studio/components/FullscreenMap';
import { SidebarProps, MapProps } from '../../shared/prop-types/ReducerProps';
import {
  changeMapWidth,
  changeMapHeight,
  changeMapViewport,
} from '../../redux/actions/mapActions';

class Map extends Component {
  static propTypes = {
    sidebar: SidebarProps.isRequired,
    map: MapProps.isRequired,
    dispatch: PropTypes.func.isRequired,
  };

  constructor() {
    super();
    this.handleChangeMapWidth = this.handleChangeMapWidth.bind(this);
    this.handleChangeMapHeight = this.handleChangeMapHeight.bind(this);
    this.handleChangeMapViewport = this.handleChangeMapViewport.bind(this);
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

  render() {
    return (
      <FullscreenMap
        sidebar={this.props.sidebar}
        map={this.props.map}
        handleChangeMapWidth={this.handleChangeMapWidth}
        handleChangeMapHeight={this.handleChangeMapHeight}
        handleChangeMapViewport={this.handleChangeMapViewport}
      />
    );
  }
}

export default withRouter(connect(state => ({
  sidebar: state.sidebar,
  map: state.map,
}))(Map));
