import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactRoutePropTypes from 'react-router-prop-types';
import { Table, Badge, Button, ButtonToolbar } from 'reactstrap';
import { Field, reduxForm } from 'redux-form';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import asyncLoading from '../../../../../shared/components/asyncLoading';
import renderFileInputField from '../../../../../shared/components/form/FileInput';
import { createDataSet } from '../../../../../redux/actions/dataSuiteActions';
import renderCheckBoxField from '../../../../../shared/components/form/CheckBox';
import validate from './validateCreateDataSetForm';
import { CREATE_DATA_SET } from '../../../../../redux/actionCreators/dataSuiteActionCreators';


class MapDataPanel extends Component {
  static propTypes = {
    dataSuite: PropTypes.instanceOf(Object).isRequired,
    newDataSetForm: PropTypes.instanceOf(Object).isRequired,
    reset: PropTypes.func.isRequired,
    dispatch: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    history: ReactRoutePropTypes.history.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      createDataSetForm: false,
    };
  }

  handleToggleCreateDataSetForm = () =>
    this.setState(prevState => ({ createDataSetForm: !prevState.createDataSetForm }));

  handleFormSubmit = (values) => {
    // Build the formData object and dispatch action
    const formData = new FormData();
    if (!values.buildNew) formData.append('file', values.data.file);
    formData.append('buildNew', values.buildNew.toString());
    formData.append('description', values.description);
    formData.append('name', values.name);
    this.props.dispatch(createDataSet(formData)).then((action) => {
      if (action.type === CREATE_DATA_SET.SUCCESS) {
        this.setState({ createDataSetForm: false });
        this.props.reset();
      }
    });
  };

  handleCancel = () => {
    this.props.reset();
    this.setState({ createDataSetForm: false });
  };

  handleEditDataSet = dataSetId => this.props.history.push(`/studio/tours/data/${dataSetId}/`);

  renderField = ({
    input, placeholder, type, meta: { touched, error },
  }) => (
    <div className="form__form-group-input-wrap">
      <input {...input} placeholder={placeholder} type={type} />
      {touched && error && <span className="form__form-group-error">{error}</span>}
    </div>
  );

  render() {
    const { dataSuite, newDataSetForm, handleSubmit } = this.props;
    const { createDataSetForm } = this.state;
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
                <td>{(set.fileSize / 1024).toFixed(3)}</td>
                <td>
                  {set.userEmail === JSON.parse(localStorage.getItem('user')).email ? (
                    <a href="/">You</a>
                  ) : (
                    <a href="/">{set.userEmail}</a>
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
        {!createDataSetForm ? (
          <Button
            size="sm"
            color="success"
            className="tours-panel__new mt-4 mb-0"
            onClick={this.handleToggleCreateDataSetForm}
          >
            <i className="fal fa-cloud-upload mr-2" />
          Upload new data set
          </Button>
        ) : (
          <form
            className="form form--horizontal mt-4"
            onSubmit={handleSubmit(this.handleFormSubmit)}
            id="new-data-set-form"
            encType="multipart/form-data"
          >
            <div className="form__form-group">
              <span className="form__form-group-label">Name</span>
              <div className="form__form-group-field">
                <Field
                  name="name"
                  component={this.renderField}
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
                  component={this.renderField}
                  type="text"
                  placeholder="This data set shows..."
                />
              </div>
            </div>
            {newDataSetForm && newDataSetForm.values && !newDataSetForm.values.buildNew && (
              <div className="form__form-group">
                <span className="form__form-group-label">Data file</span>
                <div className="form__form-group-field">
                  <Field
                    name="data"
                    accept=".json, .geojson"
                    component={renderFileInputField}
                  />
                </div>
              </div>
            )}
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
              <Button size="sm" color="success" type="submit">
                {!dataSuite.actions.CREATE_DATA_SET.loading ? (
                  <span>Create data set</span>
                ) : (
                  <span><i className="fal fa-spinner fa-spin" /> Creating data set</span>
                )}
              </Button>
              {!dataSuite.actions.CREATE_DATA_SET.loading && (
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

const reduxFormMapDataPanel = reduxForm({
  form: 'newDataSetForm',
  validate,
})(MapDataPanel);

export default asyncLoading('load__card')(withRouter(connect(state => ({
  dataSuite: state.studio.dataSuite,
  newDataSetForm: state.form.newDataSetForm,
}))(reduxFormMapDataPanel)));
