import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Field, reduxForm } from 'redux-form';
import { Container, Col, Row, Card, CardBody, ButtonToolbar, Button, Input, FormGroup, Table } from 'reactstrap';
import {
  buildForm,
  getRelatedFields,
  updateBasicFields,
  updateRelatedField,
} from '../../../../redux/actions/workshopActions';
import Loader from '../../../../shared/components/Loader';
import renderSelectField from '../../../../shared/components/form/Select';
import renderCheckboxField from '../../../../shared/components/form/CheckBox';
import { BUILD_FORM, GET_RELATED_FIELDS } from '../../../../redux/actionCreators/workshopActionCreators';

class Editor extends Component {
  static propTypes = {
    workshop: PropTypes.instanceOf(Object).isRequired,
    dispatch: PropTypes.func.isRequired,
    match: ReactRouterPropTypes.match.isRequired,
    workshopForm: PropTypes.instanceOf(Object).isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      fieldName: '',
      id: this.props.match.params.id,
    };
  }

  componentDidMount() {
    const { dispatch, match } = this.props;
    const { appName, modelName, id } = match.params;

    dispatch(buildForm(match.params))
      .then((action) => {
      // Grab the related fields for the first option in the dropdown
        if (action.type === BUILD_FORM.SUCCESS) {
          const firstRelatedField = action.form.relatedFields[0];
          const values = firstRelatedField.modelLabel.split('.');

          dispatch(getRelatedFields({
            parentAppName: appName,
            parentModelName: modelName,
            parentId: id,
            relatedAppName: values[0],
            relatedModelName: values[1].toLowerCase(),
            relatedFieldName: firstRelatedField.fieldName,
          }))
            .then((nextAction) => {
              if (nextAction.type === GET_RELATED_FIELDS.SUCCESS) {
                this.setState({
                  fieldName: firstRelatedField.fieldName,
                });
              }
            });
        }
      });
  }

  onChange = (e) => {
    e.persist();
    const { appName, modelName, id } = this.props.match.params;

    const selected = e.target.selectedOptions[0];
    const values = selected.value.split('.');

    this.setState({
      fieldName: selected.dataset.field,
    });
    this.props.dispatch(getRelatedFields({
      parentAppName: appName,
      parentModelName: modelName,
      parentId: id,
      relatedAppName: values[0],
      relatedModelName: values[1].toLowerCase(),
      relatedFieldName: selected.dataset.field,
    }));
  };

  handleUpdateBasicFields = (e) => {
    e.preventDefault();
    const { workshop, workshopForm, dispatch } = this.props;
    // Check if values object is empty, if so then return.
    if (Object.keys(workshopForm.values).length === 0 && workshopForm.values.constructor === Object) return;
    const updateData = {
      modelLabel: workshop.form.parentModel.modelLabel,
      id: this.state.id,
      values: workshopForm.values,
    };
    dispatch(updateBasicFields(updateData)).then(action => this.setState({ id: action.updates.id }));
  };

  handleUpdateRelatedField = (type, tableValues) => {
    const { dispatch, workshop } = this.props;
    const updateData = {
      modelLabel: workshop.form.parentModel.modelLabel,
      relatedModelLabel: tableValues.modelLabel,
      id: this.state.id,
      relatedId: tableValues.id,
      updateType: type,
      fieldName: this.state.fieldName,
    };
    const relatedIndex = workshop.form.relatedFields.findIndex(f => f.name === this.state.fieldName);
    const ids = workshop.form.relatedFields[relatedIndex].relatedInstances.map(o => o.tableValues.id);
    if (!ids.includes(tableValues.id)) {
      dispatch(updateRelatedField(updateData, relatedIndex)).then(action => this.setState({ id: action.updates.id }));
    }
  };

  renderField = (field) => {
    if (field.type === 'select') return renderSelectField;
    if (field.type === 'checkbox') return renderCheckboxField;
    return 'input';
  };

  render() {
    const { workshop } = this.props;
    const { form } = workshop;
    const { loading, loaded, error } = workshop.actions.BUILD_FORM;
    return (
      <Container className="mt-4">
        {loading ? (
          <Loader elemClass="load__card mb-3" />
        ) : (
          <>
            {loaded ? (
              <>
                <Row>
                  <Col md={12}>
                    <h3 className="page-title text-capitalize">
                      {form.new ? 'Create' : 'Edit'} {form.parentModel.name}
                    </h3>
                    <h3 className="page-subhead subhead">
                      Edit the basic info of this piece of content and add or remove related pieces of content
                    </h3>
                  </Col>
                </Row>
                <Row>
                  <Col md={6}>
                    <Card>
                      <CardBody>
                        <h3 className="page-title text-capitalize">Edit Basic Fields</h3>
                        <h3 className="page-subhead subhead">
                          Edit the basic info for this piece of content
                        </h3>
                        <form className="form form--horizontal" onSubmit={this.handleUpdateBasicFields}>
                          {form.basicFields.map(f => (
                            <div className="form__form-group" key={f.name}>
                              <span className="form__form-group-label text-capitalize">{f.verboseName}</span>
                              <div className="form__form-group-field">
                                <Field
                                  name={f.name}
                                  component={this.renderField(f)}
                                  field={f}
                                  type={f.type}
                                  options={f.options}
                                  placeholder={
                                    `${f.select ? 'Choose' : 'Enter'} ${f.verboseName}...`
                                  }
                                />
                              </div>
                            </div>
                          ))}
                          <ButtonToolbar className="form__button-toolbar">
                            <Button color="primary" size="sm" type="submit">Submit</Button>
                          </ButtonToolbar>
                        </form>
                        {form.relatedFields.map((f, tableIndex) => Boolean(f.relatedInstances.length) && (
                          <div key={f.name} className="mb-4">
                            <h3 className="page-title text-capitalize">{f.name.replace(/_/g, ' ')}</h3>
                            <Table responsive hover>
                              <thead>
                                <tr>
                                  <th>ID</th>
                                  <th>Description</th>
                                  <th>User</th>
                                  <th>Action</th>
                                </tr>
                              </thead>
                              <tbody>
                                {f.relatedInstances.map((o, rowIndex) => (
                                  <tr key={o.tableValues.id}>
                                    <td>{o.tableValues.id}</td>
                                    <td>{o.tableValues.descriptor}</td>
                                    <td>
                                      {o.tableValues.userEmail === JSON.parse(localStorage.getItem('user')).email ? (
                                        <a href="/">You</a>
                                      ) : (
                                        <a href="/">{o.tableValues.userEmail}</a>
                                      )}
                                    </td>
                                    <td>
                                      <p
                                        role="presentation"
                                        className="text-danger"
                                        onClick={() => this.handleUpdateRelatedField(
                                          'remove',
                                          o.tableValues,
                                          tableIndex,
                                          rowIndex,
                                        )}
                                      >
                                        <i className="fal fa-fw fa-minus-circle" /> Remove
                                      </p>
                                    </td>
                                  </tr>
                              ))}
                              </tbody>
                            </Table>
                          </div>
                        ))}
                      </CardBody>
                    </Card>
                  </Col>
                  <Col md={6}>
                    <Card>
                      <CardBody>
                        <h3 className="page-title text-capitalize">Add Related Fields</h3>
                        <h3 className="page-subhead subhead">
                          Search for and add any related content
                        </h3>
                        <FormGroup>
                          <Input
                            className="text-capitalize"
                            type="select"
                            name="transitionEasing"
                            id="transitionEasing"
                            onChange={e => this.onChange(e)}
                            value={this.state.transitionEasing}
                          >
                            {form.relatedFields.map(f => (
                              <option
                                key={f.name}
                                className="text-capitalize"
                                value={f.modelLabel}
                                data-field={f.name}
                              >
                                {f.verboseNamePlural}
                              </option>
                            ))}
                          </Input>
                        </FormGroup>
                        <Table responsive hover>
                          <thead>
                            <tr>
                              <th>ID</th>
                              <th>Description</th>
                              <th>User</th>
                              <th>Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {form.relatedFieldOptions && form.relatedFieldOptions.map((o, index) => (
                              <tr key={o.id}>
                                <td>{o.id}</td>
                                <td>{o.tableValues.descriptor}</td>
                                <td>
                                  {o.tableValues.userEmail === JSON.parse(localStorage.getItem('user')).email ? (
                                    <a href="/">You</a>
                                  ) : (
                                    <a href="/">{o.tableValues.userEmail}</a>
                                  )}
                                </td>
                                <td>
                                  <p
                                    role="presentation"
                                    className="text-success"
                                    onClick={() => this.handleUpdateRelatedField(
                                       'add',
                                       o.tableValues,
                                       index,
                                     )}
                                  >
                                    <i className="fal fa-fw fa-plus" />Add
                                  </p>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </Table>
                      </CardBody>
                    </Card>
                  </Col>
                </Row>
              </>
            ) : (
              <>
                {error && (
                  <>
                    Error
                  </>
                )}
              </>
            )}
          </>
        )}
      </Container>
    );
  }
}

const EditorWithForm = reduxForm({
  form: 'workshopForm',
})(Editor);

export default withRouter(connect(state => ({
  workshop: state.studio.workshop,
  workshopForm: state.form.workshopForm,
  initialValues: state.studio.workshop.form.defaultValues,
}))(EditorWithForm));
