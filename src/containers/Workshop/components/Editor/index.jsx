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

// Images
import iPhone from './img/iPhone.svg';

// Actions
import {
  buildForm,
  updateBasicFields,
  updateMediaField,
} from '../../../../redux/actions/workshopActions';
import {
  BUILD_FORM,
  TOGGLE_LOCATION_PICKER,
  TOGGLE_RELATED_CONTENT_FINDER,
  UPDATE_BASIC_FIELDS,
  TOGGLE_MEDIA_CENTER,
  UPDATE_MEDIA_FIELD,
} from '../../../../redux/actionCreators/workshopActionCreators';
import { SELECT_IMAGE } from '../../../../redux/actionCreators/mediaActionCreators';

// Components
import Collapse from '../../../../shared/components/Collapse';
import EditorField from '../../../../shared/components/form/TextEditor/EditorField';
import Loader from '../../../../shared/components/Loader/Loader';
import Error from '../../../../shared/components/Error';
import EditorTableWrapper from './components/EditorTableWrapper';
import LocationPicker from './components/LocationPicker';
import MediaCenter from './components/MediaCenter';
import Gallery from '../../../Media/components/Images/components/Gallery';
import RelatedContentFinder from './components/RelatedContentFinder/';

// Functions
import renderSelectField from '../../../../shared/components/form/Select';
import renderCheckboxField from '../../../../shared/components/form/CheckBox';
import renderDatePicker from '../../../../shared/components/form/DatePicker';
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
    dispatch(buildForm(queryStringValues));
  }

  componentWillUnmount() {
    this.isUnmounted = true;
    this.props.dispatch({
      type: BUILD_FORM.INIT,
    });
  }

  handleToggleLocationPicker = (e) => {
    e.preventDefault();
    this.props.dispatch({
      type: TOGGLE_LOCATION_PICKER,
    });
  };

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
            history.push(buildUrl('/workshop/editor/', {
              al: appLabel,
              mn: modelName,
              id: action.result.id,
            }));
          }
        }
      });
  };

  handleToggleMediaCenter = () => {
    this.props.dispatch({
      type: TOGGLE_MEDIA_CENTER,
    });
  };

  handleMediaOnAdd = (selected, mediaType) => {
    const { dispatch, workshop } = this.props;

    dispatch(updateMediaField({
      modelLabel: workshop.form.parentModel.modelLabel,
      id: workshop.form.parentModel.id,
      mediaType,
      mediaIds: selected,
      updateType: 'add',
    }))
      .then((action) => {
        if (action.type === UPDATE_MEDIA_FIELD.SUCCESS) {
          dispatch({
            type: TOGGLE_MEDIA_CENTER,
          });
          dispatch({
            type: SELECT_IMAGE,
            selected: [],
          });
        }
      });
  };

  handleMediaOnRemove = (e) => {
    const { dispatch, workshop } = this.props;
    const obj = JSON.parse(e.target.dataset.obj);

    dispatch(updateMediaField({
      modelLabel: workshop.form.parentModel.modelLabel,
      id: workshop.form.parentModel.id,
      mediaType: obj.type,
      mediaIds: [obj.id],
      updateType: 'remove',
    }));
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
    if (field.type === 'date' || field.type === 'datetime-local') return renderDatePicker;

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
                placeholder={this.buildPlaceholder(field)}
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
        <MediaCenter toggle={this.handleToggleMediaCenter} onAdd={this.handleMediaOnAdd} />
        <RelatedContentFinder />
        <Container className="mt-4">
          {loading ? (
            <Loader elemClass="load__card mb-3" />
          ) : (
            <>
              {loaded ? (
                <>
                  <Row>
                    <Col xs={8}>
                      <h3 className="page-title text-capitalize">
                        {form.new ? 'Create' : 'Edit'} {form.parentModel.name}
                      </h3>
                      <h3 className="page-subhead subhead">
                        Edit the basic info of this piece of content and add or remove related pieces of content
                      </h3>
                    </Col>

                    <Col xs={4}>
                      <h3 className="page-title text-capitalize">
                        Live Preview
                      </h3>
                      <h3 className="page-subhead subhead">
                        This will update as you edit the piece of content
                      </h3>
                    </Col>

                    <Col xl={8}>
                      <Card>
                        <CardBody>
                          <h3 className="page-title text-capitalize">
                            Basic Fields
                          </h3>

                          {/* Basic fields form */}
                          <form className="form form--horizontal" onSubmit={this.handleUpdateBasicFields}>
                            {form.basicFields.map(field => renderField(field))}

                            {/* Basic fields form buttons */}
                            <ButtonToolbar className="form__button-toolbar">
                              <Button color="success" size="sm" type="submit">
                                {!workshop.actions.UPDATE_BASIC_FIELDS.loading ? (
                                  <span>Submit</span>
                                ) : (
                                  <span><i className="fal fa-spin fa-spinner" /> Submitting...</span>
                                )}
                              </Button>
                              <Button color="secondary" size="sm" onClick={() => dispatch(reset('workshopForm'))}>
                                Undo changes
                              </Button>
                            </ButtonToolbar>
                          </form>
                        </CardBody>
                      </Card>

                      {!workshop.form.new && (
                        <>
                          {/* Related fields section */}
                          <Card>
                            <CardBody>
                              <Row>
                                <Col>
                                  <h3 className="page-title text-capitalize">
                                    Media
                                  </h3>
                                </Col>
                                <Col>
                                  <Button
                                    color="primary"
                                    className="float-right"
                                    onClick={this.handleToggleMediaCenter}
                                  >
                                    Add media
                                  </Button>
                                </Col>
                              </Row>
                              <Collapse
                                title="Images"
                                className="with-shadow"
                              >
                                <Gallery
                                  images={form.mediaFields.images}
                                  imageDims={{
                                   xs: 12, sm: 6, md: 6, lg: 4, xl: 3,
                                  }}
                                  controls
                                  draggable
                                  onRemove={this.handleMediaOnRemove}
                                  onClick={() => {}}
                                />
                              </Collapse>
                              <Collapse
                                title="Videos"
                                className="with-shadow"
                              >
                                <div>
                                  Not yet implemented
                                </div>
                              </Collapse>
                              <Collapse
                                title="Resources"
                                className="with-shadow"
                              >
                                <div>
                                  Not yet implemented
                                </div>
                              </Collapse>
                            </CardBody>
                          </Card>

                          {/* Related fields section */}
                          <Card>
                            <CardBody>
                              <Row>
                                <Col>
                                  <h3 className="page-title text-capitalize">
                                    Related Content
                                  </h3>
                                </Col>
                                <Col>
                                  <Button
                                    color="primary"
                                    className="float-right"
                                    onClick={this.handleToggleRelatedContentFinder}
                                  >
                                    Add related content
                                  </Button>
                                </Col>
                              </Row>
                              <EditorTableWrapper
                                fields={workshop.form.relatedFields}
                                action={workshop.actions.UPDATE_RELATED_FIELD}
                              />
                            </CardBody>
                          </Card>
                        </>
                      )}
                    </Col>

                    {/* Live preview panel */}
                    <Col xl={4}>
                      <Card>
                        <CardBody>
                          <img src={iPhone} alt="iPhone preview" style={{ opacity: 0.3 }} />
                        </CardBody>
                      </Card>
                    </Col>
                  </Row>
                </>
              ) : (
                <>
                  {error && (
                    <Error error={error} />
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
