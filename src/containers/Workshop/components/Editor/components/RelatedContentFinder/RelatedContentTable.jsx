// Absolute Imports
import React, { Component } from 'react';
import PropTypes from 'prop-types';
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
import { toast } from 'react-toastify';

// Actions
import {
  getRelatedInstanceList,
  updateRelatedField,
} from '../../../../../../redux/actions/workshopActions';
import {
  GET_INSTANCE_LIST,
  TOGGLE_RELATED_CONTENT_FINDER,
  UPDATE_RELATED_FIELD,
} from '../../../../../../redux/actionCreators/workshopActionCreators';

// Components
import MatTable from '../../../../../../shared/components/table/MatTable/index';
import Loader from '../../../../../../shared/components/Loader';
import renderSelectField from '../../../../../../shared/components/form/Select';


class InstanceFinder extends Component {
  static propTypes = {
    // Redux
    workshop: PropTypes.instanceOf(Object).isRequired,
    dispatch: PropTypes.func.isRequired,

    // Form
    finderForm: PropTypes.instanceOf(Object).isRequired,

    // Callbacks
    toggleDeleteItemModal: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      selected: [],
      page: 0,
      rowsPerPage: 5,
      timeout: null,
    };
  }

  componentDidMount() {
    const { rowsPerPage } = this.state;
    const { dispatch, workshop } = this.props;
    const relatedModelLabel = workshop.form.relatedFields[0].modelLabel;
    const { fieldName } = workshop.form.relatedFields
      .filter(f => f.modelLabel === relatedModelLabel)[0];
    const page = 0;

    dispatch(getRelatedInstanceList({
      relatedModelLabel,
      modelLabel: workshop.form.parentModel.modelLabel,
      fieldName,
      id: workshop.form.parentModel.id,
      page,
      pageSize: rowsPerPage,
    }));
  }

  componentWillUnmount() {
    this.isUnmounted = true;
  }

  getFinderOptions = () => {
    const { workshop } = this.props;

    return workshop.form.relatedFields.map(f => f.option);
  };

  getTableProps = props => ({
    ...props,
    actions: [
      {
        key: id => `edit-${id}`,
        name: 'edit',
        id: ({ name, id }) => `${name}-${id}`,
        icon: 'fal fa-fw fa-edit mr-3 text-primary',
        tooltipContent: `Edit ${props.verboseName}`,
        props: {
          className: 'workshop__form-action',
          onClick: () => {},
        },
      },
      {
        key: id => `detail-${id}`,
        name: 'detail',
        id: ({ name, id }) => `${name}-${id}`,
        icon: 'fal fa-fw fa-eye mr-3 text-info',
        tooltipContent: `View ${props.verboseName}`,
        props: {
          className: 'workshop__form-action',
          onClick: () => {},
        },
      },
    ],
  });

  handleOnChangePage = (event, page) => {
    const { rowsPerPage } = this.state;
    const { dispatch, workshop, finderForm } = this.props;
    const relatedModelLabel = finderForm.values.type.value;
    const { fieldName } = workshop.form.relatedFields
      .filter(f => f.modelLabel === relatedModelLabel)[0];

    dispatch(getRelatedInstanceList({
      relatedModelLabel,
      modelLabel: workshop.form.parentModel.modelLabel,
      fieldName,
      id: workshop.form.parentModel.id,
      page,
      pageSize: rowsPerPage,
    }))
      .then((action) => {
        if (action.type === GET_INSTANCE_LIST.SUCCESS) {
          this.setState({ selected: [], page });
        }
      });
  };

  changeInstanceType = (selected) => {
    const { rowsPerPage } = this.state;
    const { dispatch, workshop } = this.props;
    const relatedModelLabel = selected.value;
    const { fieldName } = workshop.form.relatedFields
      .filter(f => f.modelLabel === relatedModelLabel)[0];
    const page = 0;

    dispatch(getRelatedInstanceList({
      relatedModelLabel,
      modelLabel: workshop.form.parentModel.modelLabel,
      fieldName,
      id: workshop.form.parentModel.id,
      page,
      pageSize: rowsPerPage,
    }))
      .then((action) => {
        if (action.type === GET_INSTANCE_LIST.SUCCESS) {
          this.setState({ selected: [], page });
        }
      });
  };

  searchInstances = (searchTerm) => {
    const { rowsPerPage } = this.state;
    const { dispatch, workshop, finderForm } = this.props;
    const relatedModelLabel = finderForm.values.type.value;
    const { fieldName } = workshop.form.relatedFields
      .filter(f => f.modelLabel === relatedModelLabel)[0];
    const page = 0;

    dispatch(getRelatedInstanceList({
      relatedModelLabel,
      modelLabel: workshop.form.parentModel.modelLabel,
      fieldName,
      id: workshop.form.parentModel.id,
      page,
      pageSize: rowsPerPage,
      searchTerm,
    }))
      .then((action) => {
        if (action.type === GET_INSTANCE_LIST.SUCCESS) {
          this.setState({ selected: [], page });
        }
      });
  };

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
    });
  };

  handleOnSelect = (newSelected) => {
    this.setState({ selected: newSelected });
  };

  handleAddItem = (relLevel) => {
    const { selected } = this.state;
    const { workshop, finderForm, dispatch } = this.props;

    const { fieldName } = workshop.form.relatedFields
      .filter(f => f.modelLabel === finderForm.values.type.value)[0];

    const updateData = {
      modelLabel: workshop.form.parentModel.modelLabel,
      relatedModelLabel: finderForm.values.type.value,
      id: workshop.form.parentModel.id,
      relatedIds: selected,
      updateType: 'add',
      fieldName,
      relLevel,
    };

    dispatch(updateRelatedField(updateData)).then((action) => {
      const relLevelVerbose = relLevel === 'rel' ? 'relate' : 'reference';
      if (action.type === UPDATE_RELATED_FIELD.SUCCESS) {
        this.setState({ selected: [] });

        toast(`Successfully ${relLevelVerbose}d instance(s) with ID(s): ${selected}`, {
          toastId: workshop.form.parentModel.id,
        });
      }
      if (action.type === UPDATE_RELATED_FIELD.ERROR) {
        toast(`Failed to ${relLevelVerbose} instance(s) with ID(s): ${selected}. \n
        ${action.error.response.data.message}`, {
          toastId: workshop.form.parentModel.id,
        });
      }
      return null;
    });
  };

  handleToggleRelatedContentFinder = () => {
    this.props.dispatch({
      type: TOGGLE_RELATED_CONTENT_FINDER,
    });
    this.setState({ selected: [] });
  };

  render() {
    // State
    const {
      selected, page, rowsPerPage,
    } = this.state;

    // Props
    const {
      workshop,
    } = this.props;

    return (
      <>
        {/* Item search form card */}
        <Card className="pb-3">
          <CardBody className="p-3">
            <form className="workshop__content-finder__form" onSubmit={this.handleUpdateBasicFields}>
              <Row>
                {/* Search bar */}
                <Col sm={12} md={6} lg={6} xl={8} className="mb-sm-3">
                  <Field
                    name="search"
                    type="text"
                    onKeyUp={this.handleSearchInstances}
                    component="input"
                    placeholder="Search for content..."
                    className="workshop__content-finder__input"
                  />
                </Col>

                {/* Item type selector */}
                <Col sm={12} md={6} lg={6} xl={4}>
                  <Field
                    name="type"
                    type="select"
                    onChange={this.changeInstanceType}
                    component={renderSelectField}
                    options={this.getFinderOptions()}
                    className="text-capitalize"
                  />
                </Col>
              </Row>
            </form>
          </CardBody>
        </Card>

        {/* Item material table card */}
        <Card>
          <CardBody>
            <div className="changes__change-list__wrapper">
              {!workshop.actions.GET_INSTANCE_LIST.loaded ? (
                <Loader elemClass="load__card" />
                  ) : (
                    <MatTable
                      {...this.getTableProps(workshop.openList)}
                      instances={workshop.openList.instances}
                      instanceCount={workshop.openList.count}
                      tableHeads={workshop.openList.tableHeads}
                      selected={selected}
                      onSelect={this.handleOnSelect}
                      onChangePage={this.handleOnChangePage}
                      page={page}
                      rowsPerPage={rowsPerPage}
                    />
                  )}
            </div>
          </CardBody>
        </Card>

        {/* Item toolbar */}
        <ButtonToolbar>
          <Button color="primary" size="sm" onClick={() => this.handleAddItem('ref')} disabled={selected.length === 0}>
            {!(workshop.actions.UPDATE_RELATED_FIELD.loading &&
               workshop.actions.UPDATE_RELATED_FIELD.relLevel === 'ref') ? (
                 <span><i className="fal fa-plus" /> Reference {Boolean(selected.length) && selected.length}</span>
            ) : (
              <span><i className="fal fa-spin fa-spinner" /> Referencing...</span>
            )}
          </Button>
          <Button color="primary" size="sm" onClick={() => this.handleAddItem('rel')} disabled={selected.length === 0}>
            {!(workshop.actions.UPDATE_RELATED_FIELD.loading &&
               workshop.actions.UPDATE_RELATED_FIELD.relLevel === 'rel') ? (
                 <span><i className="fal fa-plus" /> Relate {Boolean(selected.length) && selected.length}</span>
            ) : (
              <span><i className="fal fa-spin fa-spinner" /> Relating...</span>
            )}
          </Button>
          <Button size="sm" onClick={this.handleToggleRelatedContentFinder}>
            Close
          </Button>
        </ButtonToolbar>
      </>
    );
  }
}

const InstanceFinderWithForm = reduxForm({
  form: 'finderForm',
})(InstanceFinder);

export default withRouter(connect(state => ({
  workshop: state.studio.workshop,
  finderForm: state.form.finderForm,
}))(InstanceFinderWithForm));
