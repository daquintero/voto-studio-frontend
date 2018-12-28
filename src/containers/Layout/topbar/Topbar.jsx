import React, { PureComponent } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import TopbarSidebarButton from './TopbarSidebarButton';
import TopbarProfile from './TopbarProfile';

class Topbar extends PureComponent {
  static propTypes = {
    changeMobileSidebarVisibility: PropTypes.func.isRequired,
    changeSidebarVisibility: PropTypes.func.isRequired,
    auth: PropTypes.instanceOf(Object).isRequired,
  };

  render() {
    const { changeMobileSidebarVisibility, changeSidebarVisibility, auth } = this.props;

    return (
      <div className="topbar">
        <div className="topbar__wrapper">
          <div className="topbar__left">
            <TopbarSidebarButton
              changeMobileSidebarVisibility={changeMobileSidebarVisibility}
              changeSidebarVisibility={changeSidebarVisibility}
            />
            <Link className="topbar__logo" to="/dashboard_default" />
          </div>
          <div className="topbar__right">
            {auth.user && (<TopbarProfile />)}
          </div>
        </div>
      </div>
    );
  }
}

export default connect(state => ({
  auth: state.auth,
}))(Topbar);
