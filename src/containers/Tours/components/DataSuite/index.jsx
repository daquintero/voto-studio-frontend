import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { Container, Row, Col, CardBody, Card } from 'reactstrap';
import asyncLoading from '../../../../shared/components/asyncLoading';
import DataPanel from './components/DataPanel';
import MapPreview from './components/MapPreview';
import Editor from './components/Editor';
import { getFeatureDetail, highlightFeature } from '../../../../redux/actions/dataSuiteActions';

class DataSuite extends Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    dataSuite: PropTypes.instanceOf(Object).isRequired,
  };

  handleEditFeature = (featureId, index) => this.props.dispatch(getFeatureDetail(featureId, index));

  handleHighlightFeature = featureId => this.props.dispatch(highlightFeature(featureId));

  render() {
    const { dataSuite } = this.props;
    const { openDataSet } = dataSuite;
    return (
      <Container className="mt-4">
        <Row>
          <Col md={12}>
            <h3 className="page-title">{dataSuite.idCode}{openDataSet.id} {openDataSet.name}</h3>
            <h3 className="page-subhead subhead">{openDataSet.description}</h3>
          </Col>
        </Row>
        <Row>
          <Col md={12} lg={12} xl={5}>
            <Card>
              <CardBody>
                <div className="card__title">
                  <h5 className="bold-text">Data panel</h5>
                  <h5 className="subhead">
                    Here you can view the data set
                  </h5>
                </div>
                <DataPanel
                  dataSuite={dataSuite}
                  highlightFeature={this.handleHighlightFeature}
                  editFeature={this.handleEditFeature}
                />
              </CardBody>
            </Card>
          </Col>
          <Col xl={7} className="data-suite__map-preview__wrapper">
            <Card>
              <CardBody>
                <div className="card__title">
                  <h5 className="bold-text">Map Data Preview</h5>
                  <h5 className="subhead">This map will update as you edit the data set</h5>
                </div>
                <MapPreview />
              </CardBody>
            </Card>
          </Col>
          <Col xl={5}>
            <Card>
              <CardBody>
                <div className="card__title">
                  <h5 className="bold-text">Editor</h5>
                  <h5 className="subhead">
                    Here you can edit the data set
                  </h5>
                </div>
                <Editor
                  action={dataSuite.actions.GET_FEATURE_DETAIL}
                  initialValues={dataSuite.openDataSet.openFeature.properties}
                  enableReinitialize
                />
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    );
  }
}

export default asyncLoading('load__page')(withRouter(connect(state => ({
  dataSuite: state.studio.dataSuite,
}))(DataSuite)));
