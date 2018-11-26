import React, { Component } from 'react';
import Loader from './Loader';

const ssyncLoading = card => WrappedComponent => class Test extends Component { // eslint-disable-line
  render() {
    if (this.props.loading) return <Loader card={card} />;
    return <WrappedComponent {...this.props} />;
  }
};

export default ssyncLoading;
