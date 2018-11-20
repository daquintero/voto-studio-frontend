import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';
import { Col, Container, Row } from 'reactstrap';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { openTour, toggleNewTourModal, createTour } from '../../../../redux/actions/tourActions';
import { ToursProps } from '../../../../shared/prop-types/ReducerProps';
import ToursList from './components/ToursList';

class ToursPanel extends Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    tours: ToursProps.isRequired,
    history: ReactRouterPropTypes.history.isRequired,
  };

  handleEditTour = (id) => {
    // Load the tour to be edited in the newTour object
    const tour = this.props.tours.tours.filter(elem => elem.id === id)[0];
    this.props.dispatch(openTour(tour));
    // Open the tour editor
    this.props.history.push('/studio/tours/map');
  };

  handleToggleCreateTourForm = () => this.props.dispatch(toggleNewTourModal());

  handleCreateTour = (tour) => {
    // Load the new tour into the newTour object
    this.props.dispatch(createTour(tour));
    // Open the tour editor
    this.props.history.push('/studio/tours/map');
    // Close the createTourForm
    this.handleToggleCreateTourForm();
    // Send POST request to create new tour instance
  };

  render() {
    return (
      <Container>
        <Row>
          <Col md={12}>
            <h3 className="page-title">Tour Panel</h3>
            <h3 className="page-subhead subhead">This is where you can create new tours and manage existing tours
            </h3>
          </Col>
        </Row>
        <Row>
          <ToursList
            tours={this.props.tours}
            editTour={this.handleEditTour}
            toggleCreateTourForm={this.handleToggleCreateTourForm}
            createTour={this.handleCreateTour}
          />
        </Row>
      </Container>
    );
  }
}

export default withRouter(connect(state => ({
  tours: state.tours,
}))(ToursPanel));
