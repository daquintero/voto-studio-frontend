// Absolute Imports
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Button } from 'reactstrap';
import { withTranslation } from 'react-i18next';

// Components
import PermissionsModal from './PermissionsModal';

// Actions
import { GET_USER_PERMISSIONS } from '../../../../../../redux/actionCreators/userActionCreators';

// Functions
import getInitials from '../../../../../../shared/utils/getInitials';


class PermissionsWidget extends Component {
  static propTypes = {
    // Redux
    dispatch: PropTypes.func.isRequired,
    auth: PropTypes.instanceOf(Object).isRequired,
    t: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      permissionsModalOpen: false,
    };
  }

  componentWillUnmount() {
    this.props.dispatch({
      type: GET_USER_PERMISSIONS.INIT,
    });
  }

  togglePermissionsModal = () => {
    this.setState(prevState => ({
      permissionsModalOpen: !prevState.permissionsModalOpen,
    }));
  };

  render() {
    // State
    const {
      permissionsModalOpen,
    } = this.state;

    // Props
    const {
      auth, t,
    } = this.props;

    return (
      <>
        <div className="permissions-widget__wrapper">
          <div className="d-flex justify-content-lg-end">
            {auth.permittedUsers.map(user => (
              <div className="permissions-widget__user">
                <img src={user.profilePictureUrl} alt="" />
                <p>
                  {user.email === JSON.parse(localStorage.getItem('user')).email ?  t('You') : getInitials(user.name)}
                </p>
              </div>
            ))}
            <div className="permissions-widget__add">
              <Button
                onClick={this.togglePermissionsModal}
              >
                {t('Share')}
              </Button>
            </div>
          </div>
        </div>
        <PermissionsModal
          isOpen={permissionsModalOpen}
          toggle={this.togglePermissionsModal}
        />
      </>
    );
  }
}

export default connect(state => ({
  auth: state.auth,
}))(withTranslation()(PermissionsWidget));
