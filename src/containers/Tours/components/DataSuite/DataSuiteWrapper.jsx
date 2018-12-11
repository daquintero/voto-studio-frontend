import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import DataSuite from './index';


class MapWrapper extends PureComponent {
  static propTypes = {
    // dispatch: PropTypes.func.isRequired,
    dataSuite: PropTypes.instanceOf(Object).isRequired,
    match: ReactRouterPropTypes.match.isRequired,
  };

  componentDidMount() {}

  render() {
    const { dataSuite, match } = this.props;
    return (
      <DataSuite
        action={dataSuite.actions.OPEN_DATA_SET}
        preloaded={dataSuite.openDataSet.id === parseInt(match.params.dataSetId, 10)}
      />
    );
  }
}

export default withRouter(connect(state => ({
  dataSuite: state.studio.dataSuite,
}))(MapWrapper));
