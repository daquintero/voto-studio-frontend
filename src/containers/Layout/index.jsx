import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import ReactRouterPropTypes from 'react-router-prop-types';
import { connect } from 'react-redux';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import Topbar from './topbar/Topbar';
import Sidebar from './sidebar/Sidebar';

import { changeMobileSidebarVisibility, changeSidebarVisibility } from '../../redux/actions/sidebarActions';
import { SidebarProps } from '../../shared/prop-types/ReducerProps';
import { changeMapWidth } from '../../redux/actions/mapActions';

class Layout extends Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    sidebar: SidebarProps.isRequired,
    location: ReactRouterPropTypes.location.isRequired,
    tours: PropTypes.instanceOf(Object).isRequired,
  };

  changeSidebarVisibility = () => {
    const {
      dispatch, location, sidebar, tours,
    } = this.props;
    dispatch(changeSidebarVisibility());
    const onTourSuite = location.pathname.toString().includes('/studio/tours/');
    if (onTourSuite) {
      const sidebarWidth = !sidebar.collapse ? 55 : 240;
      const tourPanelWidth = tours.previewTourMode ? 0 : 300;
      dispatch(changeMapWidth(window.innerWidth - (sidebarWidth + tourPanelWidth)));
    }
  };

  changeMobileSidebarVisibility = () => {
    this.props.dispatch(changeMobileSidebarVisibility());
  };

  render() {
    const layoutClass = classNames({
      layout: true,
      'layout--collapse': this.props.sidebar.collapse,
    });

    return (
      <div className={layoutClass}>
        <Topbar
          changeMobileSidebarVisibility={this.changeMobileSidebarVisibility}
          changeSidebarVisibility={this.changeSidebarVisibility}
        />
        <Sidebar
          sidebar={this.props.sidebar}
          changeMobileSidebarVisibility={this.changeMobileSidebarVisibility}
        />
      </div>
    );
  }
}

export default withRouter(connect(state => ({
  sidebar: state.sidebar,
  tours: state.studio.tours,
}))(Layout));
