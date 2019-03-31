import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';

import SidebarLink from './SidebarLink';
import SidebarCategory from './SidebarCategory';
import { SidebarProps } from '../../../shared/prop-types/ReducerProps';

class SidebarContent extends Component {
  static propTypes = {
    onClick: PropTypes.func.isRequired,
    sidebar: SidebarProps.isRequired,
    t: PropTypes.func.isRequired,
  };

  hideSidebar = () => {
    this.props.onClick();
  };

  render() {
    const { t } = this.props;
    return (
      <div className="sidebar__content">
        <ul className="sidebar__block">
          <SidebarLink title={t('Workshop')} icon="wrench" route="/workshop/" onClick={this.hideSidebar} />
          <SidebarLink title={t('Media')} icon="image" route="/media/" onClick={this.hideSidebar} />
          <SidebarLink title={t('Tours')} icon="map" route="/studio/tours/" onClick={this.hideSidebar} />
        </ul>
        <ul className="sidebar__block">
          <SidebarCategory title={t('Account')} icon="user">
            <SidebarLink title={t('Profile')} route="/account/profile/" onClick={this.hideSidebar} />
            <SidebarLink title={t('Logout')} route="/account/login/" onClick={this.hideSidebar} />
          </SidebarCategory>
          <SidebarCategory title={t('Support')} icon="question-circle">
            {/* <SidebarLink title={t('Tutorials')} route="/support/tutorials/" onClick={this.hideSidebar} /> */}
            {/* <SidebarLink title="Documentation" route="/support/docs/" onClick={this.hideSidebar} /> */}
            {/* <SidebarLink title="Contact" route="/support/contact/" onClick={this.hideSidebar} /> */}
          </SidebarCategory>
        </ul>
        {!this.props.sidebar.collapse && (
          <ul className="sidebar__block">
            <p className="ml-3">Version 1.1.3-beta</p>
          </ul>
        )}
      </div>
    );
  }
}

export default withTranslation()(SidebarContent);
