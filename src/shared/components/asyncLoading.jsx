import React, { Component } from 'react';
import Loader from './Loader';

const asyncLoading = elemType => WrappedComponent => class Test extends Component { // eslint-disable-line
  render() {
    if (this.props.preloaded) return <WrappedComponent {...this.props} />;
    if (this.props.action) {
      if (!this.props.action.loaded || this.props.action.loading) {
        return <Loader elemType={elemType} />;
      }
      if (this.props.action.error) {
        return (
          <>
            <h4>Error loading data</h4>
            <small>{this.props.action.error.message}</small>
          </>
        );
      }
      return <WrappedComponent {...this.props} />;
    }
    return null;
  }
};

export default asyncLoading;
