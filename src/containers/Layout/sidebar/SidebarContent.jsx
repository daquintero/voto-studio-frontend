import React, { Component } from 'react';
import PropTypes from 'prop-types';
import SidebarLink from './SidebarLink';
import SidebarCategory from './SidebarCategory';

class SidebarContent extends Component {
  static propTypes = {
    changeToDark: PropTypes.func.isRequired,
    changeToLight: PropTypes.func.isRequired,
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
          <SidebarLink title="Studio" icon="map" route="/studio" onClick={this.hideSidebar} />
          <SidebarLink title="New Tour" icon="plus-box" onClick={this.toggleNewTourModal} />
          <SidebarCategory title="Layout" icon="layers">
            <button className="sidebar__link" onClick={this.props.changeToLight}>
              <p className="sidebar__link-title">Light Theme</p>
            </button>
            <button className="sidebar__link" onClick={this.props.changeToDark}>
              <p className="sidebar__link-title">Dark Theme</p>
            </button>
          </SidebarCategory>
        </ul>
      </div>
    );
  }
}

export default SidebarContent;
