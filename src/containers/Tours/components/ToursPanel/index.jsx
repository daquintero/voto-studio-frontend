import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';
import { Col, Container, Row, Card, CardBody } from 'reactstrap';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { createTour, deleteTour, getTourList } from '../../../../redux/actions/tourActions';
import { ToursProps } from '../../../../shared/prop-types/ReducerProps';
import ToursList from './components/ToursList';
import MapDataPanel from './components/MapDataPanel';

class ToursPanel extends Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    tours: ToursProps.isRequired,
    history: ReactRouterPropTypes.history.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      createTourForm: false,
    };
  }

  componentDidMount() {
    this.props.dispatch(getTourList());
  }

  handleOpenTour = (tourId) => {
    this.props.history.push(`/studio/tours/map/${tourId}/`);
  };

  handleDeleteTour = id => this.props.dispatch(deleteTour(id));

  handleToggleCreateTourForm = () =>
    this.setState(prevState => ({ createTourForm: !prevState.createTourForm }));

  handleCreateTour = (newTourInfo) => {
    this.props.dispatch(createTour(newTourInfo));
    this.setState({ createTourForm: false });
  };

  render() {
    return (
      <Container className="mt-4">
        <Row>
          <Col md={12}>
            <h3 className="page-title">Tour Panel</h3>
            <h3 className="page-subhead subhead">
              This is where you can create new tours, manage existing tours, upload
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
                <ToursList
                  action={this.props.tours.actions.LIST_TOURS}
                  tourList={this.props.tours.tourList}
                  toursIdCode={this.props.tours.idCode}
                  openTour={this.handleOpenTour}
                  deleteTour={this.handleDeleteTour}
                  toggleCreateTourForm={this.handleToggleCreateTourForm}
                  createTourForm={this.state.createTourForm}
                  createTour={this.handleCreateTour}
                />
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
                <MapDataPanel
                  action={this.props.tours.actions.LIST_DATA}
                  tours={this.props.tours}
                />
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    );
  }
}

export default withRouter(connect(state => ({
  tours: state.studio.tours,
}))(ToursPanel));
