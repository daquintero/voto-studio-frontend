import React, { Component } from 'react';
import Loader from './Loader';

const asyncLoading = elemType => WrappedComponent => class Test extends Component { // eslint-disable-line
  render() {
    if (!this.props.loaded || this.props.loading) return <Loader elemType={elemType} />;
    if (this.props.error) {
      return (
        <>
          <h4>Error loading data</h4>
          <small>{this.props.error.message}</small>
        </>
      );
    }
    return <WrappedComponent {...this.props} />;
  }
};

export default asyncLoading;
