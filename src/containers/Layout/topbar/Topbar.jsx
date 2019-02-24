import React, { PureComponent } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';
import TopbarSidebarButton from './TopbarSidebarButton';
import TopbarProfile from './TopbarProfile';


class Topbar extends PureComponent {
  static propTypes = {
    // Redux
    auth: PropTypes.instanceOf(Object).isRequired,
    // Router
    location: ReactRouterPropTypes.location.isRequired,
    history: ReactRouterPropTypes.history.isRequired,
    // Sidebar
    changeMobileSidebarVisibility: PropTypes.func.isRequired,
    changeSidebarVisibility: PropTypes.func.isRequired,
  };

  handleOnClick = (e) => {
    e.persist();
    const { history } = this.props;
    const { path, index } = JSON.parse(e.target.dataset.obj);
    if (index === path.length - 1) return;
    history.push(`/${path.slice(0, index + 1).join('/')}`);
  };

  renderBreadcrumb = () => {
    const { location } = this.props;
    const path = location.pathname.split('/').filter(t => t);

    return (
      <>
        {path.map((param, index) => (
          <div key={param} className="ml-2">
            <button
              className="text-capitalize topbar__breadcrumb__link"
              onClick={this.handleOnClick}
              data-obj={JSON.stringify({ path, index })}
            >
              {param}
            </button>
            {index < path.length - 1 && (<span className="topbar__breadcrumb__separator"> /</span>)}
          </div>
        ))}
      </>
    );
  };

  render() {
    // Props
    const {
      changeMobileSidebarVisibility,
      changeSidebarVisibility,
      auth,
    } = this.props;

    return (
      <div className="topbar">
        <div className="topbar__wrapper">
          <div className="topbar__left">
            <TopbarSidebarButton
              changeMobileSidebarVisibility={changeMobileSidebarVisibility}
              changeSidebarVisibility={changeSidebarVisibility}
            />
            <Link className="topbar__logo" to="/" />
          </div>
          <div className="topbar__nav">
            {this.renderBreadcrumb()}
          </div>
          <div className="topbar__right">
            {auth.user && (<TopbarProfile />)}
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(connect(state => ({
  auth: state.auth,
}))(Topbar));
