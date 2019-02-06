import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import ProfileActivity from './ProfileActivity';
import { getUserStatistics } from '../../../../redux/actions/userActions';
import Loader from '../../../../shared/components/Loader/Loader';

class ProfileActivities extends Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    auth: PropTypes.instanceOf(Object).isRequired,
  };

  componentDidMount() {
    this.props.dispatch(getUserStatistics(JSON.parse(localStorage.getItem('user')).id));
  }

  render() {
    const { auth } = this.props;
    return (
      <>
        {!auth.actions.GET_USER_STATISTICS.init && (auth.actions.GET_USER_STATISTICS.loading ? (
          <Loader elemClass="load__card" />
        ) : (
          <>
            {auth.user.statistics.activities.map(a => (
              <ProfileActivity key={a.id} icn="fa-globe-americas" date="1 min ago" name={auth.user.name}>
                <p>{a.description}</p>
              </ProfileActivity>
            ))}
          </>
        ))}
      </>
    );
  }
}

export default connect(state => ({
  auth: state.auth,
}))(ProfileActivities);
