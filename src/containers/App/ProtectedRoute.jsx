import React from 'react';
import { connect } from 'react-redux';
import { Route, Redirect, withRouter } from 'react-router-dom';

const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={props => (
      rest.auth.authenticated ? (
        <Component {...props} />
      ) : (
        <Redirect to={{
            pathname: '/account/login',
            state: { from: props.location },
          }}
        />
      )
    )}
  />

);

export default withRouter(connect(state => ({
  auth: state.auth,
}))(PrivateRoute));
