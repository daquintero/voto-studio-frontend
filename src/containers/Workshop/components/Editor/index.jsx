// Absolute Imports
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import queryString from 'query-string';
import { Field, reduxForm, reset } from 'redux-form';
import {
  Container,
  Col,
  Row,
  Card,
  CardBody,
  ButtonToolbar,
  Button,
} from 'reactstrap';
import { ToastContainer, toast } from 'react-toastify';

// CSS
import 'react-toastify/dist/ReactToastify.css';

// Actions
import {
  buildForm,
  getRelatedFields,
  updateBasicFields,
} from '../../../../redux/actions/workshopActions';
import {
  BUILD_FORM,
  TOGGLE_LOCATION_PICKER,
  TOGGLE_RELATED_CONTENT_FINDER,
  UPDATE_BASIC_FIELDS,
} from '../../../../redux/actionCreators/workshopActionCreators';

// Components
import Collapse from '../../../../shared/components/Collapse';
import EditorField from '../../../../shared/components/form/TextEditor/EditorField';
import Loader from '../../../../shared/components/Loader/Loader';
import MatTable from './components/MatTable';
import LocationPicker from './components/LocationPicker';
import RelatedContentFinder from './components/RelatedContentFinder/';

// Functions
import renderSelectField from '../../../../shared/components/form/Select';
import renderCheckboxField from '../../../../shared/components/form/CheckBox';
import buildUrl from '../../../../shared/utils/buildUrl';


class Editor extends Component {
  static propTypes = {
    // Redux
    workshop: PropTypes.instanceOf(Object).isRequired,
    dispatch: PropTypes.func.isRequired,
    // Router
    location: ReactRouterPropTypes.location.isRequired,
    history: ReactRouterPropTypes.history.isRequired,
    // Form
    workshopForm: PropTypes.instanceOf(Object),
  };

  static defaultProps = {
    workshopForm: {},
  };

  constructor(props) {
    super(props);
    const { id } = queryString.parse(this.props.location.search);
    this.state = {
      id,
    };
  }

  componentDidMount() {
    const { dispatch, location } = this.props;
    const queryStringValues = queryString.parse(location.search);

    dispatch(buildForm(queryStringValues))
      .then((action) => {
        if (this.isUnmounted) return;
        // Grab the related fields for the first option in the dropdown
        if (action.type === BUILD_FORM.SUCCESS && action.form.relatedFields.length) {
          const firstRelatedField = action.form.relatedFields[0];
          const values = firstRelatedField.modelLabel.split('.');

          dispatch(getRelatedFields({
            parentAppLabel: queryStringValues.al,
            parentModelName: queryStringValues.mn,
            parentId: queryStringValues.id,
            relatedAppLabel: values[0],
            relatedModelName: values[1].toLowerCase(),
            relatedFieldName: firstRelatedField.fieldName,
          }));
        }
      });
  }

  componentWillUnmount() {
    this.isUnmounted = true;
  }

  handleUpdateBasicFields = (e) => {
    e.preventDefault();

    const {
      id,
    } = this.state;

    const {
      workshop, workshopForm, dispatch, history,
    } = this.props;

    const {
      selectedObject, locationIdName,
    } = workshop.locationPicker;

    // Check if values object is empty, if so then return.
    if (
      Object.keys(workshopForm.values).length === 0 &&
      workshopForm.values.constructor === Object
    ) {
      return;
    }

    // Send a request to the server to
    // update the basic fields.
    dispatch(updateBasicFields({
      modelLabel: workshop.form.parentModel.modelLabel,
      id,
      values: Object.assign(workshopForm.values, {
        locationId: selectedObject.properties[locationIdName],
        locationIdName,
      }),
    }))
      .then((action) => {
        if (action.type === UPDATE_BASIC_FIELDS.SUCCESS) {
          const {
            created, modelNameVerbose, appLabel, modelName,
          } = action.result;

          this.setState({ id: action.result.id });

          toast(`${created ? 'Created' : 'Updated'} ${modelNameVerbose} (${action.result.id})`, {
            toastId: action.result.id,
          });

          // If we are creating a new instance then redirect
          // to a new form page with the id of the new instance.
          if (id === 'new') {
            history.push(buildUrl({
              pathname: '/workshop/editor/',
              params: {
                al: appLabel,
                mn: modelName,
                id: action.result.id,
              },
            }));
          }
        }
      });
  };

  handleToggleLocationPicker = (e) => {
    e.preventDefault();
    this.props.dispatch({
      type: TOGGLE_LOCATION_PICKER,
    });
  };

  handleToggleRelatedContentFinder = () => {
    this.props.dispatch({
      type: TOGGLE_RELATED_CONTENT_FINDER,
    });
  };

  buildPlaceholder = (field) => {
    if (field.readOnly) return '';

    return (`${field.select ? 'Choose' : 'Enter'} ${field.verboseName}...`);
  };

  renderField = (field) => {
    if (field.type === 'select') return renderSelectField;
    if (field.type === 'checkbox') return renderCheckboxField;

    return 'input';
  };

  render() {
    // Props
    const {
      workshop, dispatch,
    } = this.props;

    // Workshop
    const {
      form, locationPicker,
    } = workshop;
    const {
      loading, loaded, error,
    } = workshop.actions.BUILD_FORM;

    const renderField = (field) => {
      if (field.name === 'locationId') {
        return (
          <div className="form__form-group" key={field.name}>
            <span className="form__form-group-label text-capitalize">{locationPicker.locationIdName}</span>
            <div className="form__form-group-field">
              <Button className="mb-0" onClick={this.handleToggleLocationPicker}>
                {locationPicker.hasSelectedObject ? 'Change position' : 'Select position'}
              </Button>
              <h3>{locationPicker.selectedObject.properties[locationPicker.locationIdName]}</h3>
            </div>
          </div>
        );
      }

      if (field.type === 'textarea') {
        return (
          <div className="form__form-group" key={field.name}>
            <span className="form__form-group-label text-capitalize">{field.verboseName}</span>
            <div className="form__form-group-field-editor">
              <EditorField
                name={field.name}
              />
            </div>
          </div>
        );
      }

      if (field.name === 'locationIdName') {
        return null;
      }

      return (
        <div className="form__form-group" key={field.name}>
          <span className="form__form-group-label text-capitalize">{field.verboseName}</span>
          <div className="form__form-group-field">
            <Field
              name={field.name}
              component={this.renderField(field)}
              field={field}
              type={field.type}
              options={field.options}
              placeholder={this.buildPlaceholder(field)}
              defaultChecked={field.type === 'checkbox' && field.defaultChecked}
              readOnly={field.readOnly}
            />
          </div>
          {field.readOnly && (
            <span className="form__form-group-description">
            This is a &quot;read-only&quot; field
            </span>
          )}
        </div>
      );
    };

    return (
      <>
        <ToastContainer pauseOnFocusLoss={false} />
        <LocationPicker />
        <RelatedContentFinder />
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
                    <Col xl={8}>
                      <Card>
                        <CardBody>

                          {/* Basic fields form */}
                          <form className="form form--horizontal" onSubmit={this.handleUpdateBasicFields}>
                            {form.basicFields.map(field => renderField(field))}

                            {/* Basic fields form buttons */}
                            <ButtonToolbar className="form__button-toolbar">
                              <Button color="success" size="sm" type="submit">Submit</Button>
                              <Button color="secondary" size="sm" onClick={() => dispatch(reset('workshopForm'))}>
                                Undo changes
                              </Button>
                            </ButtonToolbar>
                          </form>
                        </CardBody>
                      </Card>
                    </Col>
                  </Row>
                  {!workshop.form.new && (
                    <Row>
                      <Col xl={8}>
                        <Card>
                          <CardBody>
                            <Button onClick={this.handleToggleRelatedContentFinder}>
                              Add related content
                            </Button>

                            {/* Related fields tables */}
                            {form.relatedFields.map(field => Boolean(field.relatedInstances.instances.length) && (
                              <div key={field.name} className="mb-4">

                                {/* Related fields table */}
                                <Collapse
                                  title={`${field.verboseNamePluralTitle} (${field.relatedInstances.instances.length})`}
                                  className="with-shadow"
                                >
                                  <MatTable field={field} />
                                </Collapse>
                              </div>
                            ))}
                          </CardBody>
                        </Card>
                      </Col>
                    </Row>
                  )}
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
