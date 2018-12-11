import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Table, Badge, Button, ButtonToolbar } from 'reactstrap';
import { Field, reduxForm } from 'redux-form';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import asyncLoading from '../../../../../shared/components/asyncLoading';
import Loader from '../../../../../shared/components/Loader';
import renderFileInputField from '../../../../../shared/components/form/FileInput';
import { createDataSet } from '../../../../../redux/actions/dataSuiteActions';
import renderCheckBoxField from '../../../../../shared/components/form/CheckBox';

class MapDataPanel extends Component {
  static propTypes = {
    dataSuite: PropTypes.instanceOf(Object).isRequired,
    form: PropTypes.instanceOf(Object).isRequired,
    reset: PropTypes.func.isRequired,
    dispatch: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      createDataSetForm: false,
      formErrors: {
        name: false,
        description: false,
      },
    };
  }

  handleToggleCreateDataSetForm = () =>
    this.setState(prevState => ({ createDataSetForm: !prevState.createDataSetForm }));

  handleSubmit = (e) => {
    e.preventDefault();
    const { newDataSet } = this.props.form;
    if (!newDataSet.values) return;
    if (!newDataSet.values.name) this.setState(prevState => ({ formErrors: { ...prevState.formErrors, name: true } }));
    if (!newDataSet.values.description) {
      this.setState(prevState => ({ formErrors: { ...prevState.formErrors, description: true } }));
    }
    if (!newDataSet.values.name || !newDataSet.values.description) return;
    this.props.dispatch(createDataSet(newDataSet.values));
    this.setState({ createDataSetForm: false });
  };

  render() {
    const { dataSuite, reset, form } = this.props;
    return (
      // There should be a refresh button in the top right as another user may upload a new
      // data set whilst one user is waiting and they shouldn't have to refresh the whole page.
      // Potential use case for django channels... collaborative Voto Studio?!?!?!?
      <>
        <Table responsive hover>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Size (KB)</th>
              <th>User</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {dataSuite.dataSets.map(set => (
              <tr key={set.id}>
                <td>{dataSuite.idCode}{set.id}</td>
                <td>{set.name}</td>
                <td>{(set.file_size / 1024).toFixed(3)}</td>
                <td>
                  {set.user_email === localStorage.getItem('userEmail') ? (
                    <a href="/">You</a>
                  ) : (
                    <a href="/">{set.user_email}</a>
                  )}
                </td>
                <td><Badge color="success">Live</Badge></td>
                <td>
                  <i
                    className="fal fa-pen tours-panel__edit"
                    role="presentation"
                    // onClick={() => this.props.editTour(tour.id)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
        {dataSuite.actions.CREATE_DATA_SET.loading && (<Loader elemClass="load__card" />)}
        {!this.state.createDataSetForm ? (
          <span
            className="tours-panel__new"
            role="presentation"
            onClick={this.handleToggleCreateDataSetForm}
          >
            <i className="fal fa-cloud-upload mr-2" />
          Upload new data set
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
            {(form.newDataSet && !form.newDataSet.values.buildNew) && (
              <div className="form__form-group">
                <span className="form__form-group-label">
                  Data file
                </span>
                <div className="form__form-group-field">
                  <Field
                    name="data"
                    accept=".json, .geojson"
                    component={renderFileInputField}
                  />
                </div>
              </div>)}
            <div className="form__form-group">
              <div className="form__form-group-field">
                <Field
                  name="buildNew"
                  component={renderCheckBoxField}
                  label="Build new data set from scratch"
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
      </>
    );
  }
}

// This exporting business is messy. I want to look into a better way of doing this
export default reduxForm({
  form: 'newDataSet',
})(asyncLoading('load__card')(withRouter(connect(state => ({
  dataSuite: state.studio.dataSuite,
  form: state.form,
}))(MapDataPanel))));
