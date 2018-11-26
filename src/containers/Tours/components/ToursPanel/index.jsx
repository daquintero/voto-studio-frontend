import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';
import { Col, Container, Row, Card, CardBody } from 'reactstrap';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { createTour, getTourList } from '../../../../redux/actions/tourActions';
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

  handleToggleCreateTourForm = () =>
    this.setState(prevState => ({ createTourForm: !prevState.createTourForm }));

  handleCreateTour = (newTourInfo) => {
    // Create the new tour
    this.props.dispatch(createTour(newTourInfo));
    // Open the tour editor
    this.props.history.push('/studio/tours/map');
    // Close the createTourForm
    this.setState({ createTourForm: false });
    // Send POST request to create new tour instance
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
                  loading={this.props.tours.tourList === undefined}
                  tourList={this.props.tours.tourList}
                  toursIdCode={this.props.tours.idCode}
                  openTour={this.handleOpenTour}
                  toggleCreateTourForm={this.handleToggleCreateTourForm}
                  createTourForm={this.state.createTourForm}
                  createTour={this.handleCreateTour}
                />
              </CardBody>
            </Card>
          </Col>
          <MapDataPanel
            tours={this.props.tours}
          />
        </Row>
      </Container>
    );
  }
}

export default withRouter(connect(state => ({
  tours: state.tours,
}))(ToursPanel));
