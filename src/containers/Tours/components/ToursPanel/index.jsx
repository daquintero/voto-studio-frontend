import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';
import { Col, Container, Row } from 'reactstrap';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { openTour, createTour, getTours } from '../../../../redux/actions/tourActions';
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
    this.props.dispatch(getTours());
  }

  handleEditTour = (id) => {
    this.props.dispatch(openTour(id));
    // Open the tour editor
    this.props.history.push('/studio/tours/map');
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
          <ToursList
            tours={this.props.tours}
            editTour={this.handleEditTour}
            toggleCreateTourForm={this.handleToggleCreateTourForm}
            createTourForm={this.state.createTourForm}
            createTour={this.handleCreateTour}
          />
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
