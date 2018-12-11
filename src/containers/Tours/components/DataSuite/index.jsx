import React, { Component } from 'react';
// import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import asyncLoading from '../../../../shared/components/asyncLoading';

class DataSuite extends Component {
  static propTypes = {
    // dispatch: PropTypes.func.isRequired,
    // dataSuite: PropTypes.instanceOf(Object).isRequired,
  };

  componentWillUnmount() {}

  render() {
    // const { dataSuite } = this.props;
    return (
      <div style={{ overflow: 'hidden' }}>
        Hi
      </div>
    );
  }
}

export default asyncLoading('load__page')(withRouter(connect(state => ({
  dataSuite: state.studio.dataSuite,
}))(DataSuite)));
