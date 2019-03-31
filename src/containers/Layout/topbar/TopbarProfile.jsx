import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

class TopbarProfile extends PureComponent {
  static propTypes = {
    auth: PropTypes.instanceOf(Object).isRequired,
  };

  constructor() {
    super();
    this.state = {
      collapse: false,
    };
  }

  toggle = () => {
    this.setState({ collapse: !this.state.collapse });
  };

  render() {
    const { user } = this.props.auth;
    return (
      <div className="topbar__profile">
        <button className="topbar__avatar" onClick={this.toggle}>
          <img className="topbar__avatar-img" src={user.profilePictureUrl} alt="avatar" />
          <p className="topbar__avatar-name">{user.name}</p>
        </button>
      </div>
    );
  }
}

export default connect(state => ({
  auth: state.auth,
}))(TopbarProfile);
