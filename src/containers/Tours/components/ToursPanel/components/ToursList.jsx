import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import ReactRouterPropTypes from 'react-router-prop-types';
import { Field, reduxForm } from 'redux-form';
import { Badge, Table, Button, ButtonToolbar } from 'reactstrap';
import asyncLoading from '../../../../../shared/components/asyncLoading';
import Loader from '../../../../../shared/components/Loader';
import { createTour, deleteTour } from '../../../../../redux/actions/tourActions';

class ToursList extends Component {
  static propTypes = {
    tours: PropTypes.instanceOf(Object).isRequired,
    form: PropTypes.instanceOf(Object).isRequired,
    reset: PropTypes.func.isRequired,
    dispatch: PropTypes.func.isRequired,
    history: ReactRouterPropTypes.history.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      createTourForm: false,
      formErrors: {
        name: false,
        description: false,
      },
    };
  }

  handleSubmit = (e) => {
    e.preventDefault();
    const { newTour } = this.props.form;
    if (!newTour.values) return;
    if (!newTour.values.name) this.setState(prevState => ({ formErrors: { ...prevState.formErrors, name: true } }));
    if (!newTour.values.description) {
      this.setState(prevState => ({ formErrors: { ...prevState.formErrors, description: true } }));
    }
    if (!newTour.values.name || !newTour.values.description) return;
    this.props.dispatch(createTour(newTour.values));
    this.setState({ createTourForm: false });
  };

  handleOpenTour = tourId => this.props.history.push(`/studio/tours/map/${tourId}/`);

  handleDeleteTour = id => this.props.dispatch(deleteTour(id));

  handleToggleCreateTourForm = () =>
    this.setState(prevState => ({ createTourForm: !prevState.createTourForm }));

  render() {
    const { tours, reset } = this.props;
    return (
      <div className="tours-panel__tour-list__wrapper">
        <Table responsive hover>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>No. Steps</th>
              <th>User</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {tours.tourList.tours.map((tour, index) => (
              <tr key={tour.id}>
                <td>{tours.idCode}{tour.id}</td>
                <td>{tour.name}</td>
                <td>{tour.step_count}</td>
                <td>
                  {tour.user_email === localStorage.getItem('userEmail') ? (
                    <a href="/">You</a>
                  ) : (
                    <a href="/">{tour.user_email}</a>
                  )}
                </td>
                <td><Badge color="success">Live</Badge></td>
                <td>
                  <i
                    className="fal fa-pen tours-panel__edit mr-2"
                    role="presentation"
                    onClick={() => this.handleEditTour(tour.id, index)}
                  />
                  <i
                    className="fal fa-trash-alt tours-panel__delete mr-2"
                    role="presentation"
                    onClick={() => this.handleDeleteTour(tour.id)}
                  />
                  <i
                    className="fal fa-external-link tours-panel__open mr-2"
                    role="presentation"
                    onClick={() => this.handleOpenTour(tour.id, index)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
        {tours.actions.CREATE_TOUR.loading && (<Loader elemClass="load__card" />)}
        {!this.state.createTourForm ? (
          <span
            className="tours-panel__new"
            role="presentation"
            onClick={this.handleToggleCreateTourForm}
          >
            <i className="fal fa-plus mr-2" />
                  Add new tour
          </span>
        ) : (
          <form className="form form--horizontal" onSubmit={this.handleSubmit}>
            <div className="form__form-group">
              <span className="form__form-group-label">Name</span>
              <div className="form__form-group-field">
                <Field
                  name="name"
                  component="input"
                  type="text"
                  placeholder="My new data set"
                />
              </div>
            </div>
            <div className="form__form-group">
              <span className="form__form-group-label">Description</span>
              <div className="form__form-group-field">
                <Field
                  name="description"
                  component="input"
                  type="text"
                  placeholder="This data set shows..."
                />
              </div>
            </div>
            <ButtonToolbar className="form__button-toolbar">
              <Button color="primary" type="submit">Submit</Button>
              <Button type="button" onClick={reset}>
                Cancel
              </Button>
            </ButtonToolbar>
          </form>
        )}
      </div>
    );
  }
}

export default reduxForm({
  form: 'newTour',
})(asyncLoading('load__card')(withRouter(connect(state => ({
  tours: state.studio.tours,
  form: state.form,
}))(ToursList))));
