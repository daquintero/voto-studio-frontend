import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Layout from '../Layout/index';
import MainWrapper from './MainWrapper';
import ProtectedRoute from './ProtectedRoute';

import Dashboard from '../Dashboard';
import Workshop from '../Workshop';
import Editor from '../Workshop/components/Editor';
import Tours from '../Tours';
import MapWrapper from '../Tours/components/Map/MapWrapper';
import DataSuiteWrapper from '../Tours/components/DataSuite/DataSuiteWrapper';
import Changes from '../Changes';
import Profile from '../Account/Profile/index';
import Login from '../Account/Login';
import Register from '../Account/Register';

const EditorWrapper = props => <Editor enableReinitialize {...props} />;

// These routes are all the routes that include the top and side bar
const wrappedRoutes = () => (
  <div>
    <Layout />
    <div className="container__wrap">
      <Route exact path="/" component={Dashboard} />
      <Route exact path="/workshop/" component={Workshop} />
      <Route exact path="/workshop/editor/:appName/:modelName/:id/" render={EditorWrapper} />
      <Route exact path="/studio/tours/" component={Tours} />
      <Route exact path="/studio/tours/map/:tourId/" component={MapWrapper} />
      <Route exact path="/studio/tours/data/:dataSetId/" component={DataSuiteWrapper} />
      <Route exact path="/studio/changes/" component={Changes} />
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
