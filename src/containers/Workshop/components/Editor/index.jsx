import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';
import { connect } from 'react-redux';
import { withRouter, Link } from 'react-router-dom';
import { Field, reduxForm, reset } from 'redux-form';
import {
  Container,
  Col,
  Row,
  Card,
  CardBody,
  ButtonToolbar,
  Button,
  Input,
  FormGroup,
  Table,
  UncontrolledTooltip,
} from 'reactstrap';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  buildForm,
  getRelatedFields,
  updateBasicFields,
  updateRelatedField,
  searchRelatedFields,
} from '../../../../redux/actions/workshopActions';
import Loader from '../../../../shared/components/Loader';
import renderSelectField from '../../../../shared/components/form/Select';
import renderCheckboxField from '../../../../shared/components/form/CheckBox';
import {
  BUILD_FORM,
  GET_RELATED_FIELDS,
  UPDATE_BASIC_FIELDS,
  UPDATE_RELATED_FIELD,
} from '../../../../redux/actionCreators/workshopActionCreators';


class Editor extends Component {
  static propTypes = {
    workshop: PropTypes.instanceOf(Object).isRequired,
    dispatch: PropTypes.func.isRequired,
    match: ReactRouterPropTypes.match.isRequired,
    history: ReactRouterPropTypes.history.isRequired,
    workshopForm: PropTypes.instanceOf(Object),
  };

  static defaultProps = {
    workshopForm: {},
  };

  constructor(props) {
    super(props);
    this.state = {
      fieldName: '',
      hasRelatedFields: false,
      id: this.props.match.params.id,
    };
  }

  componentDidMount() {
    const { dispatch, match } = this.props;
    const { appName, modelName, id } = match.params;

    dispatch(buildForm(match.params))
      .then((action) => {
        if (this.isUnmounted) return;
        // Grab the related fields for the first option in the dropdown
        if (action.type === BUILD_FORM.SUCCESS && action.form.relatedFields.length) {
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
                  hasRelatedFields: true,
                });
              }
            });
        } else {
          this.setState({
            hasRelatedFields: false,
          });
        }
      });
  }

  componentWillUnmount() {
    this.isUnmounted = true;
  }

  onChange = (e) => {
    e.persist();
    const { appName, modelName, id } = this.props.match.params;

    const selected = e.target.selectedOptions[0];
    const values = selected.value.split('.');

    this.setState({
      fieldName: selected.dataset.field,
      relatedAppName: values[0],
      relatedModelName: values[1].toLowerCase(),
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

  searchRelatedFields = (e) => {
    const { relatedAppName, relatedModelName } = this.state;
    const { dispatch } = this.props;
    e.persist();
    dispatch(searchRelatedFields({
      query: e.target.value,
      term: 'name',
      al: relatedAppName,
      mn: relatedModelName,
    }));
  };

  handleUpdateBasicFields = (e) => {
    e.preventDefault();
    const {
      workshop, workshopForm, dispatch, match, history,
    } = this.props;
    const { appName, modelName, id } = match.params;
    // Check if values object is empty, if so then return.
    if (Object.keys(workshopForm.values).length === 0 && workshopForm.values.constructor === Object) return;
    const updateData = {
      modelLabel: workshop.form.parentModel.modelLabel,
      id: this.state.id,
      values: workshopForm.values,
    };
    dispatch(updateBasicFields(updateData)).then((action) => {
      if (action.type === UPDATE_BASIC_FIELDS.SUCCESS) {
        const { created, modelNameVerbose } = action.result;
        this.setState({ id: action.result.id });
        toast(`${created ? 'Created' : 'Updated'} ${modelNameVerbose} (${action.result.id})`, {
          toastId: action.result.id,
        });
        if (id === 'new') {
          history.push(`/workshop/editor/${appName}/${modelName}/${action.result.id}/`);
        }
      }
    });
  };

  handleUpdateRelatedField = (type, tableValues, tableIndex, rowIndex, fieldName) => {
    console.log(type, tableValues, tableIndex, rowIndex, fieldName);
    const {
      dispatch, workshop, match, history,
    } = this.props;
    const { appName, modelName, id } = match.params;
    const updateData = {
      modelLabel: workshop.form.parentModel.modelLabel,
      relatedModelLabel: tableValues.modelLabel,
      id: this.state.id,
      relatedId: tableValues.id,
      updateType: type,
      fieldName,
    };
    const relatedIndex = workshop.form.relatedFields.findIndex(f => f.name === fieldName);
    const ids = workshop.form.relatedFields[relatedIndex].relatedInstances.map(o => o.tableValues.id);
    if (!ids.includes(tableValues.id) || true) { // eslint-disable-line
      dispatch(updateRelatedField(updateData, relatedIndex)).then((action) => {
        if (action.type === UPDATE_RELATED_FIELD.SUCCESS) {
          const {
            field, relatedField, relatedId,
          } = action.result;
          this.setState({ id: action.result.id });
          toast(`${action.result.type === 'add' ? 'Added' : 'Removed'} ${relatedField.modelNameVerbose} (${relatedId})`
            + `${action.result.type === 'add' ? ' to' : ' from'} ${field.modelNameVerbose} (${action.result.id})`, {
            toastId: action.result.id,
          });
          if (id === 'new') {
            history.push(`/workshop/editor/${appName}/${modelName}/${action.result.id}/`);
          }
        }
      });
    }
  };

  buildPlaceholder = (field) => {
    if (field.readOnly) {
      return '';
    }
    return (`${field.select ? 'Choose' : 'Enter'} ${field.verboseName}...`);
  };

  renderField = (field) => {
    if (field.type === 'select') return renderSelectField;
    if (field.type === 'checkbox') return renderCheckboxField;
    return 'input';
  };

  render() {
    const { workshop, dispatch } = this.props;
    const { form } = workshop;
    const { loading, loaded, error } = workshop.actions.BUILD_FORM;
    const { fieldName } = this.state;
    return (
      <>
        <ToastContainer pauseOnFocusLoss={false} />
        <Container className="mt-4">
          {loading ? (
            <Loader elemClass="load__card mb-3" />
          ) : (
            <>
              {loaded ? (
                <>
                  <Row>
                    <Col md={12}>
                      <Link to="/workshop/" className="text-black-50">
                        <i className="fal fa-chevron-circle-left" /> back to workshop
                      </Link>
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
                                    placeholder={this.buildPlaceholder(f)}
                                    defaultChecked={f.type === 'checkbox' && f.defaultChecked}
                                    readOnly={f.readOnly}
                                  />
                                </div>
                                {f.readOnly && (
                                  <span className="form__form-group-description">
                                    This is a &quot;read-only&quot; field
                                  </span>
                                )}
                              </div>
                            ))}
                            <ButtonToolbar className="form__button-toolbar">
                              <Button color="success" size="sm" type="submit">Submit</Button>
                              <Button color="secondary" size="sm" onClick={() => dispatch(reset('workshopForm'))}>
                                Undo changes
                              </Button>
                            </ButtonToolbar>
                          </form>
                          {form.relatedFields.map((f, tableIndex) => Boolean(f.relatedInstances.length) && (
                            <div key={f.name} className="mb-4">
                              <h3 className="page-title text-capitalize">{f.name.replace(/_/g, ' ')}</h3>
                              <Table responsive hover>
                                <thead>
                                  <tr>
                                    <th>ID</th>
                                    {f.tableHeads ? f.tableHeads.map(o => (
                                      <th className="text-capitalize">{o.replace(/_/g, ' ')}</th>
                                    )) : (
                                      <th />
                                    )}
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
                                        <span
                                          role="presentation"
                                          className="workshop__form-action mr-3"
                                          onClick={() => this.handleUpdateRelatedField(
                                            'remove',
                                            o.tableValues,
                                            rowIndex,
                                            tableIndex,
                                            f.fieldName,
                                          )}
                                        >
                                          <i
                                            className="fal fa-fw fa-minus-circle text-danger"
                                            id={`remove-${o.tableValues.modelName}-${o.tableValues.id}`}
                                          />
                                        </span>
                                        <span
                                          role="presentation"
                                          className="workshop__form-action"
                                          data-obj={JSON.stringify(o)}
                                          onClick={this.handleViewItem}
                                        >
                                          <i
                                            className="fal fa-fw fa-eye text-success"
                                            id={`details-${o.tableValues.modelName}-${o.tableValues.id}`}
                                          />
                                        </span>
                                        <UncontrolledTooltip
                                          placement="top"
                                          target={`remove-${o.tableValues.modelName}-${o.tableValues.id}`}
                                        >
                                          Remove {f.verboseName}
                                        </UncontrolledTooltip>
                                        <UncontrolledTooltip
                                          placement="top"
                                          target={`details-${o.tableValues.modelName}-${o.tableValues.id}`}
                                        >
                                          View {f.verboseName}
                                        </UncontrolledTooltip>
                                      </td>
                                    </tr>
                                ))}
                                </tbody>
                              </Table>
                            </div>
                          ))}
                        </CardBody>
                      </Card>
                      <Card>
                        <CardBody>
                          {this.state.hasRelatedFields ? (
                            <>
                              <h3 className="page-title text-capitalize">Add Related Fields</h3>
                              <h3 className="page-subhead subhead">
                                Search for and add any related content
                              </h3>
                              <Row>
                                <Col xl={8}>
                                  <FormGroup>
                                    <Input
                                      type="text"
                                      name="transitionEasing"
                                      id="transitionEasing"
                                      onKeyUp={this.searchRelatedFields}
                                    />
                                  </FormGroup>
                                </Col>
                                <Col xl={4}>
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
                                </Col>
                              </Row>
                              {!form.relatedFieldOptions ? (
                                <Loader elemClass="load__card" />
                            ) : (
                              <Table responsive hover>
                            <>
                              <thead>
                                <tr>
                                  <th>ID</th>
                                  {form.tableHeads.length ? form.tableHeads.map(o => (
                                    <th key={o} className="text-capitalize">{o.replace(/_/g, ' ')}</th>
                                  )) : (
                                    <th />
                                  )}
                                  <th>User</th>
                                  <th>Actions</th>
                                </tr>
                              </thead>
                              <tbody>
                                {form.relatedFieldOptions.length ? form.relatedFieldOptions.map((o, index) => (
                                  <tr key={o.id}>
                                    <td>{o.id}</td>
                                    {o.tableValues.descriptors.values.map(d => (
                                      <td key={d.name}>{d.value}</td>
                                    ))}
                                    <td>
                                      {o.tableValues
                                        .userEmail === JSON.parse(localStorage.getItem('user')).email ? (
                                          <a href="/">You</a>
                                      ) : (
                                        <a href="/">{o.tableValues.userEmail}</a>
                                      )}
                                    </td>
                                    <td>
                                      <span
                                        role="presentation"
                                        className="workshop__form-action mr-3"
                                        onClick={() => this.handleUpdateRelatedField(
                                          'add',
                                          o.tableValues,
                                          index,
                                          null,
                                          fieldName,
                                        )}
                                      >
                                        <i
                                          className="fal fa-fw fa-plus-circle text-primary"
                                          id={`add-${o.tableValues.modelName}-${o.tableValues.id}`}
                                        />
                                      </span>
                                      <span
                                        role="presentation"
                                        className="workshop__form-action"
                                        data-obj={JSON.stringify(o)}
                                        onClick={this.handleViewItem}
                                      >
                                        <i
                                          className="fal fa-fw fa-eye text-success"
                                          id={`details-${o.tableValues.modelName}-${o.tableValues.id}`}
                                        />
                                      </span>
                                      <UncontrolledTooltip
                                        placement="top"
                                        target={`add-${o.tableValues.modelName}-${o.tableValues.id}`}
                                      >
                                        Add {form.verboseName}
                                      </UncontrolledTooltip>
                                      <UncontrolledTooltip
                                        placement="top"
                                        target={`details-${o.tableValues.modelName}-${o.tableValues.id}`}
                                      >
                                        View {form.verboseName}
                                      </UncontrolledTooltip>
                                    </td>
                                  </tr>
                            )) : (
                              <tr>
                                <td>No items</td>
                              </tr>
                            )}
                              </tbody>
                            </>
                              </Table>
                            )}
                            </>
                          ) : (
                            <>
                              <h3 className="page-title text-capitalize">No related fields</h3>
                              <h3 className="page-subhead subhead">
                                This content type has no related pieces of content
                              </h3>
                            </>
                          )}
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
      </>
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
