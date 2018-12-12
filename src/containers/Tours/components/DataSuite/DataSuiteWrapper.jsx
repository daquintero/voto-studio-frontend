import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import DataSuite from './index';
import { getDataSetDetail } from '../../../../redux/actions/dataSuiteActions';

class MapWrapper extends PureComponent {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    dataSuite: PropTypes.instanceOf(Object).isRequired,
    match: ReactRouterPropTypes.match.isRequired,
  };

  componentDidMount() {
    const { dispatch, match } = this.props;
    dispatch(getDataSetDetail(match.params.dataSetId));
  }

  render() {
    const { dataSuite, match } = this.props;
    return (
      <DataSuite
        action={dataSuite.actions.GET_DATA_SET_DETAIL}
        preloaded={dataSuite.openDataSet.id === parseInt(match.params.dataSetId, 10)}
      />
    );
  }
}

export default withRouter(connect(state => ({
  dataSuite: state.studio.dataSuite,
}))(MapWrapper));
