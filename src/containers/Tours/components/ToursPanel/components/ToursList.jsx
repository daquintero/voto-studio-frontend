import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import ReactRouterPropTypes from 'react-router-prop-types';
import { Field, reduxForm } from 'redux-form';
import { Badge, Table, Button, ButtonToolbar } from 'reactstrap';
import asyncLoading from '../../../../../shared/components/asyncLoading';
import { createTour, deleteTour } from '../../../../../redux/actions/tourActions';
import { CREATE_TOUR } from '../../../../../redux/actionCreators/tourActionCreators';
import validate from './validateCreateTourForm';


class ToursList extends Component {
  static propTypes = {
    handleSubmit: PropTypes.func.isRequired,
    tours: PropTypes.instanceOf(Object).isRequired,
    reset: PropTypes.func.isRequired,
    dispatch: PropTypes.func.isRequired,
    history: ReactRouterPropTypes.history.isRequired,
    type: PropTypes.string,
    meta: PropTypes.shape({
      touched: PropTypes.bool,
      error: PropTypes.string,
    }),
  };

  static defaultProps = {
    type: 'text',
    meta: null,
  };

  constructor(props) {
    super(props);
    this.state = {
      createTourForm: false,
    };
  }

  handleSubmit = (values) => {
    if (!values.name || !values.description) return;
    this.props.dispatch(createTour(values)).then((action) => {
      if (action.type === CREATE_TOUR.SUCCESS) {
        this.setState({ createTourForm: false });
        this.props.reset();
      }
    });
  };

  handleCancel = () => {
    this.props.reset();
    this.setState({ createTourForm: false });
  };

  handleOpenTour = tourId => this.props.history.push(`/studio/tours/map/${tourId}/`);

  handleDeleteTour = id => this.props.dispatch(deleteTour(id));

  handleToggleCreateTourForm = () =>
    this.setState(prevState => ({ createTourForm: !prevState.createTourForm }));

  renderField = ({
    input, placeholder, type, meta: { touched, error },
  }) => (
    <div className="form__form-group-input-wrap">
      <input {...input} placeholder={placeholder} type={type} />
      {touched && error && <span className="form__form-group-error">{error}</span>}
    </div>
  );

  render() {
    const { handleSubmit, tours } = this.props;
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
                <td>{tour.stepCount}</td>
                <td>
                  {tour.userEmail === JSON.parse(localStorage.getItem('user')).email ? (
                    <a href="/">You</a>
                  ) : (
                    <a href="/">{tour.userEmail}</a>
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
        {!this.state.createTourForm ? (
          <Button
            size="sm"
            color="success"
            className="tours-panel__new mt-4 mb-0"
            onClick={this.handleToggleCreateTourForm}
          >
            <i className="fal fa-plus mr-2" />
            Create new tour
          </Button>
        ) : (
          <form className="form form--horizontal mt-4" onSubmit={handleSubmit(this.handleSubmit)}>
            <div className="form__form-group">
              <span className="form__form-group-label">Name</span>
              <div className="form__form-group-field">
                <Field
                  name="name"
                  component={this.renderField}
                  type="text"
                  placeholder="My new tour"
                />
              </div>
            </div>
            <div className="form__form-group">
              <span className="form__form-group-label">Description</span>
              <div className="form__form-group-field">
                <Field
                  name="description"
                  component={this.renderField}
                  type="text"
                  placeholder="This tour tells people about..."
                />
              </div>
            </div>
            <ButtonToolbar className="form__button-toolbar">
              <Button size="sm" color="success" type="submit">
                {!tours.actions.CREATE_TOUR.loading ? (
                  <span>Create tour</span>
                ) : (
                  <span><i className="fal fa-spinner fa-spin" /> Creating tour</span>
                )}
              </Button>
              {!tours.actions.CREATE_TOUR.loading && (
                <Button size="sm" type="button" onClick={this.handleCancel}>
                  Cancel
                </Button>
              )}
            </ButtonToolbar>
          </form>
        )}
      </div>
    );
  }
}

const reduxFormToursList = reduxForm({
  form: 'newTour',
  validate,
})(ToursList);

export default asyncLoading('load__card')(withRouter(connect(state => ({
  tours: state.studio.tours,
  newTourForm: state.form.newTourForm,
}))(reduxFormToursList)));
