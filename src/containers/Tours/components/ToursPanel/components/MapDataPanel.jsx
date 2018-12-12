import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactRoutePropTypes from 'react-router-prop-types';
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
    handleSubmit: PropTypes.func.isRequired,
    history: ReactRoutePropTypes.history.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      createDataSetForm: false,
      formErrors: {
        name: false,
        description: false,
        file: false,
      },
    };
  }

  handleToggleCreateDataSetForm = () =>
    this.setState(prevState => ({ createDataSetForm: !prevState.createDataSetForm }));

  handleFormSubmit = (formProps) => {
    // Validate the form data
    const { values } = this.props.form.newDataSet;
    const formErrors = {
      name: false,
      description: false,
      file: false,
    };
    if (!values) return;
    if (!values.name) formErrors.name = true;
    if (!values.description) formErrors.description = true;
    if (!values.buildNew && !values.data) formErrors.file = true;

    this.setState({ formErrors });
    if (formErrors.name || formErrors.description || (!values.buildNew && formErrors.file)) return;


    // Build the formData object and dispatch action
    const formData = new FormData();
    if (!formProps.buildNew) formData.append('file', formProps.data.file);
    formData.append('buildNew', formProps.buildNew.toString());
    formData.append('description', formProps.description);
    formData.append('name', formProps.name);
    this.props.dispatch(createDataSet(formData));
    this.setState({ createDataSetForm: false });
  };

  handleCancel = () => {
    this.props.reset();
    this.setState({ createDataSetForm: false });
  };

  handleEditDataSet = dataSetId => this.props.history.push(`/studio/tours/data/${dataSetId}/`);

  render() {
    const { dataSuite, form, handleSubmit } = this.props;
    const { formErrors } = this.state;
    return (
      // There should be a refresh button in the top right as another user may upload a new
      // data set whilst one user is waiting and they shouldn't have to refresh the whole page.
      // Potential use case for django channels... collaborative Voto Studio?!?!?!?
      <div className="tours-panel__data-set-list__wrapper">
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
                    onClick={() => this.handleEditDataSet(set.id)}
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
          <form
            className="form form--horizontal"
            onSubmit={handleSubmit(this.handleFormSubmit)}
            id="new-data-set-form"
            encType="multipart/form-data"
          >
            <div className="form__form-group">
              <span className="form__form-group-label">
                Name{formErrors.name && <><br /><span className="text-danger">required field</span></>}
              </span>
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
              <span className="form__form-group-label">
                Description{formErrors.description && <><br /><span className="text-danger">required field</span></>}
              </span>
              <div className="form__form-group-field">
                <Field
                  name="description"
                  component="input"
                  type="text"
                  placeholder="This data set shows..."
                />
              </div>
            </div>
            {form.newDataSet && (form.newDataSet.values && (!form.newDataSet.values.buildNew && (
              <div className="form__form-group">
                <span className="form__form-group-label">
                  Data file{formErrors.file && <><br /><span className="text-danger">file required</span></>}
                </span>
                <div className="form__form-group-field">
                  <Field
                    name="data"
                    accept=".json, .geojson"
                    component={renderFileInputField}
                  />
                </div>
              </div>)))}
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
              <Button type="button" onClick={this.handleCancel}>
                Cancel
              </Button>
            </ButtonToolbar>
          </form>
        )}
      </div>
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
