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
  publishInstances,
} from '../../../../redux/actions/workshopActions';
import {
  getUserPermissions,
} from '../../../../redux/actions/userActions';
import {
  BUILD_FORM,
  TOGGLE_LOCATION_PICKER,
  TOGGLE_RELATED_CONTENT_FINDER,
  UPDATE_BASIC_FIELDS,
  TOGGLE_MEDIA_CENTER,
  UPDATE_MEDIA_FIELD,
  SELECT_POSITION,
  PUBLISH_INSTANCES,
} from '../../../../redux/actionCreators/workshopActionCreators';
import {
  SELECT_FILE,
  SELECT_TAB,
} from '../../../../redux/actionCreators/mediaActionCreators';

// Components
import Collapse from '../../../../shared/components/Collapse';
import EditorField from '../../../../shared/components/form/TextEditor/EditorField';
import ErrorPage from '../../../../shared/components/ErrorPage';
import EditorTableWrapper from './components/EditorTableWrapper';
import FileGallery from '../../../Media/components/FileGallery';
import Loader from '../../../../shared/components/Loader';
import MediaCenter from './components/MediaCenter';
import PermissionsWidget from './components/PermissionsWidget';
import PublishInstancesModal from '../../../../shared/components/PublishInstancesModal';
import RelatedContentFinder from './components/RelatedContentFinder/';

// Functions
import buildUrl from '../../../../shared/utils/buildUrl';
import renderCheckboxField from '../../../../shared/components/form/CheckBox';
import renderDatePicker from '../../../../shared/components/form/DatePicker';
import renderJSONFieldEditor from './components/JSONFieldEditor';
import renderSelectField from '../../../../shared/components/form/Select';
import renderLocationPickerField from '../../../../shared/components/form/LocationPicker';


const mediaModelLabelFieldNameMap = {
  'media.Image': 'images',
  'media.Video': 'videos',
  'media.Resource': 'resources',
};


class Editor extends Component {
  static propTypes = {
    // Redux
    auth: PropTypes.instanceOf(Object).isRequired,
    dispatch: PropTypes.func.isRequired,
    media: PropTypes.instanceOf(Object).isRequired,
    workshop: PropTypes.instanceOf(Object).isRequired,

    // Router
    history: ReactRouterPropTypes.history.isRequired,
    location: ReactRouterPropTypes.location.isRequired,

    // Form
    workshopForm: PropTypes.instanceOf(Object),
  };

  static defaultProps = {
    // Form
    workshopForm: {},
  };

  constructor(props) {
    super(props);
    const { id } = queryString.parse(this.props.location.search);
    this.state = {
      id,
      publishInstancesModalOpen: false,
    };
  }

  componentDidMount() {
    const { dispatch, location } = this.props;
    const queryStringValues = queryString.parse(location.search);

    dispatch(buildForm(queryStringValues))
      .then((action) => {
        if (this.isUnmounted) return;
        if (action.type === BUILD_FORM.SUCCESS && !action.form.new) {
          dispatch(getUserPermissions({
            ml: action.form.parentModel.modelLabel,
            id: action.form.parentModel.id,
          }));
          dispatch({
            type: SELECT_TAB,
            activeTab: 'media.Image',
          });
        }
      });
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
      values: Object.assign(workshopForm.values),
    }))
      .then((action) => {
        if (action.type === UPDATE_BASIC_FIELDS.SUCCESS) {
          const {
            created, verboseName, appLabel, modelName,
          } = action.response;
          const instanceId = action.response.id;

          this.setState({ id: instanceId });

          toast(`${created ? 'Created' : 'Updated'} ${verboseName} (${instanceId})`, {
            toastId: instanceId,
          });

          // If we are creating a new instance then redirect
          // to a new form page with the id of the new instance.
          if (id === 'new') {
            history.replace(buildUrl('/workshop/editor/', {
              al: appLabel,
              mn: modelName,
              id: instanceId,
            }));
            dispatch(getUserPermissions({
              ml: workshop.form.parentModel.modelLabel,
              id: instanceId,
            }));
          }
        }
        if (action.type === UPDATE_BASIC_FIELDS.ERROR) {
          const {
            modelName,
          } = workshop.form.parentModel;

          toast(`Error creating ${modelName}`, {
            toastId: modelName,
          });
        }
      });
  };

  handleLocationOnChange = (e) => {
    const { dispatch, workshop } = this.props;
    const { locationIdName } = workshop.locationPicker;
    const selectedObject = workshop.locationPicker.dataSet.geojson.features
      .filter(f => f.properties[locationIdName] === e.target.value)[0];
    if (selectedObject !== undefined) {
      dispatch({
        type: SELECT_POSITION,
        selectedObject,
      });
    }
  };

  handleToggleMediaCenter = () => {
    this.props.dispatch({
      type: TOGGLE_MEDIA_CENTER,
    });
  };

  handleMediaOnAdd = (selected) => {
    const { dispatch, workshop, media } = this.props;

    dispatch(updateMediaField({
      modelLabel: workshop.form.parentModel.modelLabel,
      mediaModelLabel: media.files.activeTab,
      id: workshop.form.parentModel.id,
      mediaType: mediaModelLabelFieldNameMap[media.files.activeTab],
      mediaIds: selected,
      updateType: 'add',
    }))
      .then((action) => {
        if (action.type === UPDATE_MEDIA_FIELD.SUCCESS) {
          dispatch({
            type: TOGGLE_MEDIA_CENTER,
          });
          dispatch({
            type: SELECT_FILE,
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
      mediaIds: [obj.fileId],
      mediaModelLabel: obj.modelLabel,
      updateType: 'remove',
    }));
  };

  handleToggleRelatedContentFinder = () => {
    this.props.dispatch({
      type: TOGGLE_RELATED_CONTENT_FINDER,
    });
  };

  handleTogglePublishInstancesModal = () => {
    this.setState(prevState => ({
      publishInstancesModalOpen: !prevState.publishInstancesModalOpen,
    }));
  };

  handlePublishInstancesModalOnClose = () => {
    const { dispatch } = this.props;
    dispatch({
      type: PUBLISH_INSTANCES.INIT,
    });
  };

  handleOnPublish = () => {
    const { dispatch, workshop } = this.props;
    const { modelLabel, id } = workshop.form.parentModel;
    dispatch(publishInstances({
      modelLabel,
      ids: [id],
    }));
  };

  buildPlaceholder = (field) => {
    if (field.readOnly) return '';

    return (`${field.select ? 'Choose' : 'Enter'} ${field.verboseName}...`);
  };

  renderFieldComponent = (field) => {
    if (field.type === 'select') return renderSelectField;
    if (field.type === 'checkbox') return renderCheckboxField;
    if (field.type === 'date' || field.type === 'datetime-local') return renderDatePicker;

    return 'input';
  };

  renderField = (field) => {
    // Props
    const {
      workshop,
    } = this.props;

    if (field.name === 'location') {
      return (
        <div className="form__form-group">
          <span className="form__form-group-label text-capitalize">Location</span>
          <div className="form__form-group-field">
            <Field
              name="location"
              component={renderLocationPickerField}
            />
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

    if (field.type === 'json') {
      return (
        <div className="form__form-group" key={field.name}>
          <span className="form__form-group-label text-capitalize">{field.verboseName}</span>
          <div className="form__form-group-field-json-editor">
            <Field
              name={field.name}
              component={renderJSONFieldEditor}
              field={workshop.form.defaultValues[field.name]}
            />
          </div>
        </div>
      );
    }

    return (
      <div className="form__form-group" key={field.name}>
        <span className="form__form-group-label text-capitalize">{field.verboseName}</span>
        <div className="form__form-group-field">
          <Field
            name={field.name}
            component={this.renderFieldComponent(field)}
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

  render() {
    // State
    const {
      publishInstancesModalOpen, id,
    } = this.state;

    // Props
    const {
      workshop, auth, dispatch,
    } = this.props;

    // Workshop
    const {
      form,
    } = workshop;
    const {
      loading, loaded, error,
    } = workshop.actions.BUILD_FORM;

    return (
      <Container className="mt-4">
        {loading ? (
          <Loader elemClass="load__page" />
        ) : (
          <>
            {loaded ? (
              <>
                <ToastContainer pauseOnFocusLoss={false} />
                <MediaCenter toggle={this.handleToggleMediaCenter} onAdd={this.handleMediaOnAdd} />
                <Row>
                  <Col lg={12} xl={4}>
                    <h3 className="page-title text-capitalize">
                      {form.new ? 'Create' : 'Edit'} {form.parentModel.modelName}
                    </h3>
                    <h3 className="page-subhead subhead">
                      Edit the basic info of this piece of content and add or remove related pieces of content
                    </h3>
                  </Col>

                  <Col xs lg={4}>
                    {!workshop.form.new && (
                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'row',
                          justifyContent: 'flex-end',
                          marginTop: 10,
                        }}
                      >
                        <PermissionsWidget />
                        {auth.user.isResearcher ? (
                          <>
                            <PublishInstancesModal
                              isOpen={publishInstancesModalOpen}
                              action={workshop.actions.PUBLISH_INSTANCES}
                              selected={[id]}

                              // Callbacks
                              toggle={this.handleTogglePublishInstancesModal}
                              onPublish={this.handleOnPublish}
                              onClose={this.handlePublishInstancesModalOnClose}
                            />
                            <Button
                              className="ml-3"
                              color="primary"
                              onClick={this.handleTogglePublishInstancesModal}
                            >
                              Publish
                            </Button>
                          </>
                        ) : (
                          <Button className="ml-3" color="primary" onClick={this.handlePublishInstances}>
                            {!workshop.actions.SUBMIT_FOR_REVIEW.loading ? (
                              <span>Submit for Review</span>
                            ) : (
                              <span><i className="fal fa-spin fa-spinner" /> Submitting...</span>
                            )}
                          </Button>
                        )}
                      </div>
                    )}
                  </Col>

                  <Col xs={4} className="d-none d-xl-block">
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
                          {form.basicFields.map(this.renderField)}

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
                        {/* Media fields section */}
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
                              <FileGallery
                                files={form.mediaFields.images}
                                fileDims={{
                                  xs: 12, sm: 6, md: 6, lg: 4, xl: 3,
                                }}
                                controls
                                standalone
                                draggable
                                onRemove={this.handleMediaOnRemove}
                                onClick={() => {}}
                              />
                            </Collapse>
                            <Collapse
                              title="Videos"
                              className="with-shadow"
                            >
                              <FileGallery
                                files={form.mediaFields.videos}
                                fileDims={{
                                  xs: 12, sm: 6, md: 6, lg: 4, xl: 3,
                                }}
                                controls
                                standalone
                                onRemove={this.handleMediaOnRemove}
                                onClick={() => {}}
                              />
                            </Collapse>
                            <Collapse
                              title="Resources"
                              className="with-shadow"
                            >
                              <FileGallery
                                files={form.mediaFields.resources}
                                fileDims={{
                                  xs: 12, sm: 6, md: 6, lg: 4, xl: 3,
                                }}
                                controls
                                standalone
                                onRemove={this.handleMediaOnRemove}
                                onClick={() => {}}
                              />
                            </Collapse>
                          </CardBody>
                        </Card>

                        {/* Related fields section */}
                        {form.relatedFields.length !== 0 && (
                          <>
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
                            <RelatedContentFinder />
                          </>
                        )}
                      </>
                    )}
                  </Col>

                  {/* Live preview panel */}
                  <Col xs={12} className="d-block d-xl-none">
                    <h3 className="page-title text-capitalize">
                      Live Preview
                    </h3>
                    <h3 className="page-subhead subhead">
                      This will update as you edit the piece of content
                    </h3>
                  </Col>
                  <Col xl={4}>
                    <Card>
                      <CardBody className="p-5">
                        <img src={iPhone} className="img-fluid" alt="iPhone preview" style={{ opacity: 0.3 }} />
                      </CardBody>
                    </Card>
                  </Col>
                </Row>
              </>
            ) : (
              error && (
                <ErrorPage error={error} />
              )
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
  auth: state.auth,
  initialValues: state.studio.workshop.form.defaultValues,
  media: state.studio.media,
  workshop: state.studio.workshop,
  workshopForm: state.form.workshopForm,
}))(EditorWithForm));
