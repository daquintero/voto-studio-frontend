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

// Actions
import { buildFinder, getInstanceList } from '../../../redux/actions/workshopActions';
import { BUILD_FINDER, GET_INSTANCE_LIST } from '../../../redux/actionCreators/workshopActionCreators';

// Components
import MatTable from '../../../shared/components/table/MatTable';
import Loader from '../../../shared/components/Loader/Loader';
import renderSelectField from '../../../shared/components/form/Select';

// Functions
import buildUrl from '../../../shared/utils/buildUrl';


class InstanceFinder extends Component {
  static propTypes = {
    // Redux
    dispatch: PropTypes.func.isRequired,
    workshop: PropTypes.instanceOf(Object).isRequired,

    // Router
    history: ReactRouterPropTypes.history.isRequired,

    // Form
    finderForm: PropTypes.instanceOf(Object).isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      selected: [],
      page: 0,
      rowsPerPage: 10,
      timeout: null,
    };
  }

  componentDidMount() {
    const { rowsPerPage } = this.state;
    const { dispatch } = this.props;
    const page = 0;
    dispatch(buildFinder()).then((action) => {
      if (this.isUnmounted) return;
      // If the buildFinder action is successful
      // then load instances for the first item
      // type in the items list.
      if (action.type === BUILD_FINDER.SUCCESS) {
        dispatch(getInstanceList({
          modelLabel: action.finder.items[0].modelLabel,
          page,
          pageSize: rowsPerPage,
        }));
      }
    });
  }

  componentWillUnmount() {
    this.isUnmounted = true;
  }

  getTableProps = props => ({
    ...props,
    actions: [
      {
        key: id => id,
        name: 'edit',
        id: ({ name, id }) => `${name}-${id}`,
        'data-id': id => id,
        icon: 'fal fa-fw fa-edit mr-3 text-primary',
        tooltipContent: `Edit ${props.verboseName}`,
        props: {
          className: 'workshop__form-action',
          onClick: this.handleEditItem,
        },
      },
      {
        key: id => id,
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

  changeInstanceType = (selected) => {
    const { rowsPerPage } = this.state;
    const { dispatch } = this.props;
    const page = 0;

    dispatch(getInstanceList({
      modelLabel: selected.value,
      page,
      pageSize: rowsPerPage,
    }))
      .then((action) => {
        if (action.type === GET_INSTANCE_LIST.SUCCESS) {
          this.setState({ selected: [], page: 0 });
        }
      });
  };

  handleOnSelect = (newSelected) => {
    this.setState({ selected: newSelected });
  };

  handleOnChangePage = (event, page) => {
    const { rowsPerPage } = this.state;
    const { dispatch, finderForm } = this.props;

    dispatch(getInstanceList({
      modelLabel: finderForm.values.type.value,
      page,
      pageSize: rowsPerPage,
    }))
      .then((action) => {
        if (action.type === GET_INSTANCE_LIST.SUCCESS) {
          this.setState({ page, selected: [] });
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

  searchInstances = (searchTerm) => {
    const { rowsPerPage } = this.state;
    const { dispatch, finderForm } = this.props;
    const page = 0;

    dispatch(getInstanceList({
      modelLabel: finderForm.values.type.value,
      page,
      pageSize: rowsPerPage,
      searchTerm,
    }))
      .then((action) => {
        if (action.type === GET_INSTANCE_LIST.SUCCESS) {
          this.setState({ page, selected: [] });
        }
      });
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
            <form className="workshop__itemfinder__form" onSubmit={this.handleUpdateBasicFields}>
              <Row>

                {/* Search bar */}
                <Col xl={8}>
                  <Field
                    name="search"
                    type="text"
                    onKeyUp={this.handleSearchInstances}
                    component="input"
                    placeholder="Search for content..."
                    className="workshop__itemfinder__input"
                  />
                </Col>

                {/* Item type selector */}
                <Col>
                  <Field
                    name="type"
                    type="select"
                    onChange={this.changeInstanceType}
                    component={renderSelectField}
                    options={workshop.finder.options}
                    className="text-capitalize"
                  />
                </Col>
              </Row>
            </form>

            {/* Item toolbar */}
            <ButtonToolbar>
              <Button color="primary" size="sm" onClick={this.handleCreateItem}>
                <i className="fal fa-plus" /> Create
              </Button>
              <Button color="success" size="sm" disabled={selected.length === 0}>
                Commit {selected.length !== 0 && <>{selected.length} item{selected.length === 1 ? '' : 's'}</>}
              </Button>
              <Button color="danger" size="sm" disabled={selected.length === 0}>
                Delete {selected.length !== 0 && <>{selected.length} item{selected.length === 1 ? '' : 's'}</>}
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
                <MatTable
                  {...this.getTableProps(workshop.openList)}
                  instances={workshop.openList.instances}
                  instanceCount={workshop.openList.count}
                  tableHeads={workshop.openList.tableHeads}
                  onSelect={this.handleOnSelect}
                  onChangePage={this.handleOnChangePage}
                  page={page}
                  rowsPerPage={rowsPerPage}
                />
              )}
            </div>
          </CardBody>
        </Card>
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
