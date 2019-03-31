// Absolute Imports
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { reduxForm, Field } from 'redux-form';
import {
  Card,
  CardBody,
  Button,
  ButtonToolbar,
  Row,
  Col,
} from 'reactstrap';
import { withTranslation } from 'react-i18next';

// Actions
import {
  buildFinder,
  getInstanceList,
  deleteInstances,
  publishInstances,
} from '../../../../redux/actions/workshopActions';
import {
  BUILD_FINDER,
  GET_INSTANCE_LIST,
  SELECT_INSTANCE_TYPE,
  DELETE_INSTANCES,
  PUBLISH_INSTANCES,
} from '../../../../redux/actionCreators/workshopActionCreators';

// Components
import MatTable from '../../../../shared/components/table/MatTable/index';
import Loader from '../../../../shared/components/Loader';
import renderSelectField from '../../../../shared/components/form/Select';
import DeleteInstancesModal from '../../../../shared/components/DeleteInstancesModal';
import PublishInstanceModel from '../../../../shared/components/PublishInstancesModal';

// Functions
import buildUrl from '../../../../shared/utils/buildUrl';


class ContentFinder extends Component {
  static propTypes = {
    // Redux
    dispatch: PropTypes.func.isRequired,
    workshop: PropTypes.instanceOf(Object).isRequired,

    // Router
    history: ReactRouterPropTypes.history.isRequired,

    // Form
    finderForm: PropTypes.instanceOf(Object),
  };

  static defaultProps = {
    finderForm: {},
  };

  constructor(props) {
    super(props);
    this.state = {
      selected: [],
      page: 0,
      rowsPerPage: 10,
      timeout: null,
      deleteInstancesModalOpen: false,
      publishInstancesModalOpen: false,
      searchTerm: '',
    };
  }

  componentDidMount() {
    const { rowsPerPage } = this.state;
    const { dispatch, workshop } = this.props;
    const page = 0;

    if (workshop.finder.built) return;

    dispatch(buildFinder())
      .then((action) => {
        if (this.isUnmounted) return;
        // If the buildFinder action is successful
        // then load instances for the first item
        // type in the items list.
        if (action.type === BUILD_FINDER.SUCCESS) {
          const {
            currentItemOption, currentUserOption,
          } = action.finder.filter;

          dispatch(getInstanceList({
            modelLabel: currentItemOption.value,
            filter: currentUserOption.value,
            page,
            pageSize: rowsPerPage,
          }));
        }
      });
  }

  componentWillUnmount() {
    this.isUnmounted = true;
  }

  getTableProps = ({ verboseName, ...rest }) => {
    const { t } = this.props;

    return ({
      ...rest,
      actions: [
        {
          key: id => `edit-${id}`,
          name: 'edit',
          id: ({ name, id }) => `${name}-${id}`,
          'data-id': id => id,
          icon: () => 'fal fa-fw fa-edit mr-3 text-primary',
          tooltipContent: () => `${t('Edit')} ${t(verboseName)}`,
          props: {
            className: 'workshop__form-action',
            onClick: this.handleEditItem,
          },
        },
        {
          key: id => `detail-${id}`,
          name: 'detail',
          id: ({ name, id }) => `${name}-${id}`,
          icon: ({ published }) => `fal fa-fw fa-eye mr-3 text-${published ? 'info' : 'secondary'}`,
          tooltipContent: ({ published }) => (published ? `${t('View')} ${t(verboseName)}` : t('Yet to be published')),
          props: {
            className: 'workshop__form-action',
            onClick: () => {
            },
          },
        },
      ],
    });
  };

  changeInstanceFilter = (selected, ...rest) => {
    const { rowsPerPage } = this.state;
    const { dispatch, finderForm, workshop } = this.props;
    const page = 0;

    let listData;
    if (rest[2] === 'type') {
      listData = {
        modelLabel: selected.value,
        filter: finderForm.values.user.value,
      };
    } else if (rest[2] === 'user') {
      listData = {
        modelLabel: finderForm.values.type.value,
        filter: selected.value,
      };
    }

    dispatch(getInstanceList({
      ...listData,
      page,
      pageSize: rowsPerPage,
    }))
      .then((action) => {
        if (action.type === GET_INSTANCE_LIST.SUCCESS) {
          // Reset the selector state. As a new instance
          // type has been loaded it is impossible that
          // any new instances are selected.
          this.setState({
            selected: [],
            page: 0,
          });
          // Update state with the instance type loaded
          // so on the next componentDidMount this type
          // is loaded instead of the first in the list.
          dispatch({
            type: SELECT_INSTANCE_TYPE,
            filter: {
              currentItemOption: workshop.finder.filter.itemOptions
                .filter(f => f.value === listData.modelLabel)[0],
              currentUserOption: workshop.finder.filter.userOptions
                .filter(f => f.value === listData.filter)[0],
            },
          });
        }
      });
  };

  handleOnSelect = (newSelected) => {
    this.setState({ selected: newSelected });
  };

  handleOnChangePage = (event, page) => {
    const { rowsPerPage, searchTerm } = this.state;
    const { dispatch, finderForm } = this.props;

    dispatch(getInstanceList({
      modelLabel: finderForm.values.type.value,
      filter: finderForm.values.user.value,
      page,
      pageSize: rowsPerPage,
      searchTerm,
    }))
      .then((action) => {
        if (action.type === GET_INSTANCE_LIST.SUCCESS) {
          this.setState({
            page,
            selected: [],
          });
        }
      });
  };

  handleOnChangeRowsPerPage = () => {};

  handleSearchInstances = (e) => {
    e.persist();
    const { timeout } = this.state;

    if (timeout) {
      clearTimeout(timeout);
    }

    this.setState({
      timeout: setTimeout(() => {
        this.searchInstances(e.target.value);
      }, 600),
      searchTerm: e.target.value,
    });
  };

  searchInstances = (searchTerm) => {
    const { rowsPerPage } = this.state;
    const { dispatch, finderForm } = this.props;
    const page = 0;

    dispatch(getInstanceList({
      modelLabel: finderForm.values.type.value,
      filter: finderForm.values.user.value,
      page,
      pageSize: rowsPerPage,
      searchTerm,
    }))
      .then((action) => {
        if (action.type === GET_INSTANCE_LIST.SUCCESS) {
          this.setState({
            page,
            selected: [],
          });
        }
      });
  };

  translateOptions = (options) => {
    const { t } = this.props;

    return options.map(opt => ({
      label: t(opt.label),
      value: opt.value,
    }));
  };

  openEditor = (id) => {
    const { history, finderForm } = this.props;
    const [appLabel, modelName] = finderForm.values.type.value.split('.');
    history.push(buildUrl('/workshop/editor/', {
      al: appLabel.toLowerCase(),
      mn: modelName.toLowerCase(),
      id,
    }));
  };

  handleCreateItem = () => this.openEditor('new');

  handleEditItem = (e) => {
    e.persist();
    const { id } = JSON.parse(e.currentTarget.dataset.obj);
    this.openEditor(id);
  };

  handleToggleDeleteInstancesModal = () => {
    this.setState(prevState => ({
      deleteInstancesModalOpen: !prevState.deleteInstancesModalOpen,
    }));
  };

  handleDeleteInstancesModelOnClose = () => {
    const { dispatch } = this.props;
    dispatch({
      type: DELETE_INSTANCES.INIT,
    });
  };

  handleOnDelete = () => {
    const { selected } = this.state;
    const { dispatch, workshop } = this.props;
    dispatch(deleteInstances({
      ids: selected,
      modelLabel: workshop.finder.filter.currentItemOption.value,
    }))
      .then((action) => {
        if (action.type === DELETE_INSTANCES.SUCCESS) {
          this.setState({
            selected: [],
          });
        }
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
    const { selected } = this.state;
    const { dispatch, workshop } = this.props;
    dispatch(publishInstances({
      ids: selected,
      modelLabel: workshop.finder.filter.currentItemOption.value,
    }))
      .then((action) => {
        if (action.type === PUBLISH_INSTANCES.SUCCESS) {
          this.setState({
            selected: [],
          });
        }
      });
  };

  render() {
    // State
    const {
      selected, page, rowsPerPage, deleteInstancesModalOpen, publishInstancesModalOpen,
    } = this.state;

    // Props
    const {
      workshop, t,
    } = this.props;

    return (
      <>
        {/* Modals */}
        <DeleteInstancesModal
          isOpen={deleteInstancesModalOpen}
          action={workshop.actions.DELETE_INSTANCES}
          selected={selected}

          // Callbacks
          toggle={this.handleToggleDeleteInstancesModal}
          onDelete={this.handleOnDelete}
          onClose={this.handleDeleteInstancesModelOnClose}
        />
        <PublishInstanceModel
          isOpen={publishInstancesModalOpen}
          action={workshop.actions.PUBLISH_INSTANCES}
          selected={selected}

          // Callbacks
          toggle={this.handleTogglePublishInstancesModal}
          onPublish={this.handleOnPublish}
          onClose={this.handlePublishInstancesModalOnClose}
        />

        {/* Item search form card */}
        <Card className="pb-3">
          <CardBody className="p-3">
            <form className="workshop__content-finder__form" onSubmit={this.handleUpdateBasicFields}>
              <Row>

                {/* Search bar */}
                <Col sm={12} md={12} lg={4} xl={6} className="mb-3 mb-lg-0">
                  <Field
                    name="search"
                    type="text"
                    onKeyUp={this.handleSearchInstances}
                    component="input"
                    placeholder={t('Search for content...')}
                    className="workshop__content-finder__input"
                  />
                </Col>

                {/* Item type selector */}
                <Col sm={12} md={6} lg={4} xl={3} className="mb-3 mb-md-0">
                  <Field
                    name="type"
                    type="select"
                    onChange={this.changeInstanceFilter}
                    component={renderSelectField}
                    placeholder={t('Model Type')}
                    options={this.translateOptions(workshop.finder.filter.itemOptions)}
                    className="text-capitalize"
                  />
                </Col>

                {/* User filter selector */}
                <Col sm={12} md={6} lg={4} xl={3}>
                  <Field
                    name="user"
                    type="select"
                    onChange={this.changeInstanceFilter}
                    component={renderSelectField}
                    placeholder={t('User Options')}
                    options={this.translateOptions(workshop.finder.filter.userOptions)}
                    className="text-capitalize"
                  />
                </Col>
              </Row>
            </form>

            {/* Item toolbar */}
            <ButtonToolbar>
              <Button
                color="primary"
                size="sm"
                onClick={this.handleCreateItem}
                disabled={selected.length !== 0}
              >
                <i className="fal fa-plus" /> {t('Create')}
              </Button>
              <Button
                color="success"
                size="sm"
                onClick={this.handleTogglePublishInstancesModal}
                disabled={selected.length === 0}
              >
                {t('Publish')}
              </Button>
              <Button
                color="warning"
                size="sm"
                disabled={selected.length === 0}
              >
                {t('Un-publish')}
              </Button>
              <Button
                color="danger"
                size="sm"
                onClick={this.handleToggleDeleteInstancesModal}
                disabled={selected.length === 0}
              >
                <i className="fal fa-trash p-1" /> {t('Delete')}
              </Button>
            </ButtonToolbar>
          </CardBody>
        </Card>

        {/* Item material table card */}
        <Card>
          <CardBody>
            <div className="changes__change-list__wrapper">
              {!workshop.actions.GET_INSTANCE_LIST.loaded ? (
                <Loader elemClass="load__card" />
              ) : (
                <>
                  <MatTable
                    {...this.getTableProps(workshop.openList)}
                    instances={workshop.openList.instances}
                    instanceCount={workshop.openList.count}
                    tableHeads={workshop.openList.tableHeads}
                    selected={selected}
                    onSelect={this.handleOnSelect}
                    onChangePage={this.handleOnChangePage}
                    onChangeRowsPerPage={this.handleOnChangeRowsPerPage}
                    page={page}
                    rowsPerPage={rowsPerPage}
                  />
                  {selected.length !== 0 && (
                    <span className="text-black-50">
                      {selected.length} item{selected.length === 1 ? '' : 's'} {t('selected')}
                    </span>
                  )}
                </>
              )}
            </div>
          </CardBody>
        </Card>
      </>
    );
  }
}

const ContentFinderWithForm = reduxForm({
  form: 'finderForm',
})(ContentFinder);

export default withRouter(connect(state => ({
  workshop: state.studio.workshop,
  finderForm: state.form.finderForm,
}))(withTranslation()(ContentFinderWithForm)));
