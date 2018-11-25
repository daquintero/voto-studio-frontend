import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Layout from '../Layout/index';
import MainWrapper from './MainWrapper';
import ProtectedRoute from './ProtectedRoute';

import Tours from '../Tours';
import Map from '../Tours/components/Map';
import Profile from '../Account/Profile/index';
import Login from '../Account/Login';
import Register from '../Account/Register';

// These routes are all the routes that include the top and side bar
const wrappedRoutes = () => (
  <div>
    <Layout />
    <div className="container__wrap">
      <Route exact path="/studio/tours/" component={Tours} />
      <Route exact path="/studio/tours/map/:tourId/" component={Map} />
      <Route exact path="/account/profile/" component={Profile} />
    </div>
  </div>
);

const Router = () => (
  <MainWrapper>
    <main>
      <Switch>
        <Route exact path="/account/login/" component={Login} />
        <Route exact path="/account/signup/" component={Register} />
        <ProtectedRoute path="/" component={wrappedRoutes} />
      </Switch>
    </main>
  </MainWrapper>
);

export default Router;
