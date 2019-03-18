import React from 'react';
import { connect } from 'react-redux';
import { Route, Redirect } from 'react-router-dom';


const PrivateRoute = ({ component: PrivateComponent, ...rest }) => (
  <Route
    {...rest}
    render={props => (
      rest.auth.authenticated ? (
        <PrivateComponent {...props} />
      ) : (
        <Redirect to={{
          pathname: '/account/login/',
          state: { from: props.location },
        }}
        />
      )
    )}
  />
);

export default connect(state => ({
  auth: state.auth,
}))(PrivateRoute);
