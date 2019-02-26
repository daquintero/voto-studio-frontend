import React, { Component } from 'react';
import PropTypes from 'prop-types';
import SidebarLink from './SidebarLink';
import SidebarCategory from './SidebarCategory';
import { SidebarProps } from '../../../shared/prop-types/ReducerProps';

class SidebarContent extends Component {
  static propTypes = {
    onClick: PropTypes.func.isRequired,
    sidebar: SidebarProps.isRequired,
  };

  hideSidebar = () => {
    this.props.onClick();
  };

  render() {
    return (
      <div className="sidebar__content">
        <ul className="sidebar__block">
          <SidebarLink title="Workshop" icon="wrench" route="/workshop/" onClick={this.hideSidebar} />
          <SidebarLink title="Media" icon="image" route="/media/" onClick={this.hideSidebar} />
          <SidebarLink title="Tours" icon="map" route="/studio/tours/" onClick={this.hideSidebar} />
        </ul>
        <ul className="sidebar__block">
          <SidebarCategory title="Account" icon="user">
            <SidebarLink title="Profile" route="/account/profile/" onClick={this.hideSidebar} />
            <SidebarLink title="Logout" route="/account/login/" onClick={this.hideSidebar} />
          </SidebarCategory>
          <SidebarCategory title="Support" icon="question-circle">
            <SidebarLink title="Tutorials" route="/support/tutorials/" onClick={this.hideSidebar} />
            <SidebarLink title="Documentation" route="/support/docs/" onClick={this.hideSidebar} />
            <SidebarLink title="Contact" route="/support/contact/" onClick={this.hideSidebar} />
          </SidebarCategory>
        </ul>
        {!this.props.sidebar.collapse && (
          <ul className="sidebar__block">
            <p className="ml-3">Version 1.1.0-beta</p>
          </ul>
        )}
      </div>
    );
  }
}

export default SidebarContent;
