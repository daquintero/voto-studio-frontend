import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Layout from '../Layout/index';
import MainWrapper from './MainWrapper';
import ProtectedRoute from './ProtectedRoute';

import Tours from '../Tours';
import Map from '../Tours/components/Map';
import Profile from '../Account/components/Profile/index';
import LogIn from '../LogIn';

// These routes are all the routes that include the top and side bar
const wrappedRoutes = () => (
  <div>
    <Layout />
    <div className="container__wrap">
      <Route exact path="/studio/tours" component={Tours} />
      <Route exact path="/studio/tours/map" component={Map} />
      <Route exact path="/account/profile" component={Profile} />
    </div>
  </div>
);

const Router = () => (
  <MainWrapper>
    <main>
      <Switch>
        <Route exact path="/account/login" component={LogIn} />
        <ProtectedRoute path="/" component={wrappedRoutes} />
      </Switch>
    </main>
  </MainWrapper>
);

export default Router;
