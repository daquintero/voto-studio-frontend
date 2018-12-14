import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import MatTable from '../../../shared/components/table/MatTable';
import asyncLoading from '../../../shared/components/asyncLoading';

class ChangesList extends Component {
  static propTypes = {
    changes: PropTypes.instanceOf(Object).isRequired,
    commitChanges: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      pageName: 'committed',
    };
  }

  render() {
    const { changes, commitChanges } = this.props;
    return (
      <div className="changes__change-list__wrapper">
        <MatTable changes={changes} commitChanges={commitChanges} pageName={this.state.pageName} />
      </div>
    );
  }
}

export default asyncLoading('load__card')(withRouter(connect(state => ({
  changes: state.studio.changes,
}))(ChangesList)));
