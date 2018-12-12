import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Col } from 'reactstrap';
import EditableTable from './EditableTable';

class Editor extends Component {
  static propTypes = {
    dataSuite: PropTypes.instanceOf(Object).isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { dataSuite } = this.props;
    return (
      <>
        {dataSuite.openDataSet.openFeature.editing && (
          <Col xl={12}>
            <EditableTable dataSuite={dataSuite} />
          </Col>
        )}
      </>
    );
  }
}

export default connect(state => ({
  dataSuite: state.studio.dataSuite,
}))(Editor);
