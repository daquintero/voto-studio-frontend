import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Col, Container, Row, Card, CardBody } from 'reactstrap';
import { connect } from 'react-redux';
import { getTourList } from '../../../../redux/actions/tourActions';
import { getDataSetList } from '../../../../redux/actions/dataSuiteActions';
import { ToursProps } from '../../../../shared/prop-types/ReducerProps';
import ToursList from './components/ToursList';
import MapDataPanel from './components/MapDataPanel';

class ToursPanel extends Component {
  static propTypes = {
    auth: PropTypes.instanceOf(Object).isRequired,
    dispatch: PropTypes.func.isRequired,
    tours: ToursProps.isRequired,
    dataSuite: PropTypes.instanceOf(Object).isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount() {
    const { actions } = this.props.auth;
    // TODO: Should these reload every time the route is loaded????
    if (actions.LOGIN_USER.loaded || actions.REGISTER_USER.loaded) {
      this.props.dispatch(getTourList());
      this.props.dispatch(getDataSetList());
    }
  }

  render() {
    const { tours, dataSuite } = this.props;
    return (
      <Container className="mt-4">
        <Row>
          <Col md={12}>
            <h3 className="page-title">Tour Panel</h3>
            <h3 className="page-subhead subhead">
              This is where you can create new tours, manage existing tours, upload or
              manage map data sets and much more
            </h3>
          </Col>
        </Row>
        <Row>
          <Col md={12} lg={12} xl={6}>
            <Card>
              <CardBody>
                <div className="card__title">
                  <h5 className="bold-text">Your Tours</h5>
                  <h5 className="subhead">
                    Here are the tours you have created, press the edit button to edit a tour in the Map Studio
                  </h5>
                </div>
                <ToursList action={tours.actions.LIST_TOURS} />
              </CardBody>
            </Card>
          </Col>
          <Col md={12} lg={12} xl={6}>
            <Card>
              <CardBody>
                <div className="card__title">
                  <h5 className="bold-text">Map Data Sets</h5>
                  <h5 className="subhead">Here are the data sets that can be used in the Map Studio</h5>
                </div>
                <MapDataPanel action={dataSuite.actions.LIST_DATA_SETS} />
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    );
  }
}

export default connect(state => ({
  tours: state.studio.tours,
  dataSuite: state.studio.dataSuite,
  auth: state.auth,
}))(ToursPanel);
