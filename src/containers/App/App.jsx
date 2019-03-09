// Absolute Imports
import React, { Component } from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { hot } from 'react-hot-loader';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';

// Styles
import 'mapbox-gl/dist/mapbox-gl.css';
import 'bootstrap/dist/css/bootstrap.css';
import '../../scss/app.scss';

// Store
import store from './store';

// Components
import Loader from '../../shared/components/Loader';
import Router from './Router';
import ScrollToTop from './ScrollToTop';

// Actions
import { LOGIN_USER } from '../../redux/actionCreators/userActionCreators';
import { getUserDetail } from '../../redux/actions/userActions';


class App extends Component {
  constructor() {
    super();
    this.state = {
      loaded: false,
    };
  }

  componentDidMount() {
    const user = localStorage.getItem('user') ?
      JSON.parse(localStorage.getItem('user')) :
      {};
    // Check to see if the user is already logged in
    if (user.token) {
      store.dispatch(getUserDetail(user.id))
        .then((response) => {
          store.dispatch({
            type: LOGIN_USER.SUCCESS,
            user: response.user,
          });
        });
    }

    window.addEventListener('load', () => {
      setTimeout(() => {
        this.setState({
          loaded: true,
        });
      }, 500);
    });
  }

  render() {
    const { loaded } = this.state;
    return (
      <Provider store={store}>
        <BrowserRouter>
          <ScrollToTop>
            {!loaded ? (
              <Loader elemClass="load__page" />
            ) : (
              <div>
                <Router />
              </div>
            )}
          </ScrollToTop>
        </BrowserRouter>
      </Provider>
    );
  }
}

export default hot(module)(App);
