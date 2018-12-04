import React, { Component } from 'react';
import Loader from './Loader';

// This is a higher-order-component. It is a function that takes an argument elemType that returns another
// function that takes an argument WrappedComponent which is the component we want to load. This function
// returns a class that finally renders either a loading circle, an error or the WrappedComponent.
const asyncLoading = elemClass => WrappedComponent => class Test extends Component { // eslint-disable-line
  render() {
    // If data is already in store then load component
    if (this.props.preloaded) return <WrappedComponent {...this.props} />;
    // If the component has only been initialised
    if (this.props.action.init) return null;
    // Load the loading circle if the it is loading
    if (this.props.action.loading) {
      return <Loader elemClass={elemClass} />;
    }
    // Show the error message if the request errors
    // TODO: Maybe provide a callback function that can be called to attempt to reload the data from the server?
    if (this.props.action.error) {
      return (
        <>
          <h4>Error loading data</h4>
          <small>{this.props.action.error.message}</small>
        </>
      );
    }
    // If not loading or there is no error then return the component
    return <WrappedComponent {...this.props} />;
  }
};

export default asyncLoading;
