import React, { Component } from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { hot } from 'react-hot-loader';
import { Provider } from 'react-redux';
import axios from 'axios';
import { normalize, schema } from 'normalizr';
import { BrowserRouter } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.css';
import '../../scss/app.scss';
import Router from './Router';
import store from './store';
import ScrollToTop from './ScrollToTop';

class App extends Component {
  constructor() {
    super();
    this.state = {
      loading: true,
      loaded: false,
    };
  }

  componentDidMount() {
    window.addEventListener('load', () => {
      this.setState({ loading: false });
      setTimeout(() => this.setState({ loaded: true }), 500);
    });

    const user = new schema.Entity('users');
    const userList = new schema.Array(user);

    axios.get('http://127.0.0.1:8000/users/api/v1/')
      .then(response => console.log(normalize(response.data, userList)));  // eslint-disable-line

    const marker = new schema.Entity('markers');
    const step = new schema.Entity('steps', {
      markers: [marker],
    });
    const tour = new schema.Entity('tour', {
      steps: [step],
    });

    axios.get('http://127.0.0.1:8000/tours/api/v1/1/')
      .then(response => console.log(normalize(response.data, tour)));  // eslint-disable-line
  }

  render() {
    const { loaded, loading } = this.state;
    return (
      <Provider store={store}>
        <BrowserRouter>
          <ScrollToTop>
            {!loaded &&
            <div className={`load${loading ? '' : ' loaded'}`}>
              <div className="load__icon-wrap">
                <svg className="load__icon">
                  <path fill="#4ce1b6" d="M12,4V2A10,10 0 0,0 2,12H4A8,8 0 0,1 12,4Z" />
                </svg>
              </div>
            </div>
            }
            <div>
              <Router />
            </div>
          </ScrollToTop>
        </BrowserRouter>
      </Provider>
    );
  }
}

export default hot(module)(App);
