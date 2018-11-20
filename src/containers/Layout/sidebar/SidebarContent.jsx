import React, { Component } from 'react';
import PropTypes from 'prop-types';
import SidebarLink from './SidebarLink';
import SidebarCategory from './SidebarCategory';

class SidebarContent extends Component {
  static propTypes = {
    onClick: PropTypes.func.isRequired,
    toggleNewTourModal: PropTypes.func.isRequired,
  };

  hideSidebar = () => {
    this.props.onClick();
  };

  toggleNewTourModal = (e) => {
    e.preventDefault();
    this.props.toggleNewTourModal();
  };

  render() {
    return (
      <div className="sidebar__content">
        <ul className="sidebar__block">
          <SidebarCategory title="Studio" icon="map">
            <SidebarLink title="Tours" route="/studio/tours" onClick={this.hideSidebar} />
            <SidebarLink title="Candidates" route="/studio/candidates" onClick={this.hideSidebar} />
          </SidebarCategory>
        </ul>
      </div>
    );
  }
}

export default SidebarContent;
