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
import { buildFinder, getInstanceList } from '../../../../redux/actions/workshopActions';
import { BUILD_FINDER, GET_INSTANCE_LIST } from '../../../../redux/actionCreators/workshopActionCreators';

// Components
import MatTable from './components/MatTable';
import Loader from '../../../../shared/components/Loader/Loader';
import renderSelectField from '../../../../shared/components/form/Select';

// Functions
import buildUrl from '../../../../shared/utils/buildUrl';


class InstanceFinder extends Component {
  static propTypes = {
    // Redux
    workshop: PropTypes.instanceOf(Object).isRequired,
    dispatch: PropTypes.func.isRequired,
    // Router
    history: ReactRouterPropTypes.history.isRequired,
    // Form
    finderForm: PropTypes.instanceOf(Object).isRequired,
    // Callbacks
    toggleDeleteItemModal: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      selectedIds: [],
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(buildFinder()).then((action) => {
      if (this.isUnmounted) return;
      // If the buildFinder action is successful
      // then load instances for the first item
      // type in the items list.
      if (action.type === BUILD_FINDER.SUCCESS) {
        dispatch(getInstanceList(action.finder.items[0].modelLabel));
      }
    });
  }

  componentWillUnmount() {
    this.isUnmounted = true;
  }

  changeInstanceType = (selected) => {
    const { dispatch } = this.props;
    dispatch(getInstanceList(selected.value)).then((action) => {
      if (action.type === GET_INSTANCE_LIST.SUCCESS) {
        this.setState({ selectedIds: [] });
      }
    });
  };

  handleSelectItem = (newSelected) => {
    this.setState({ selectedIds: newSelected });
  };

  openEditor = (id) => {
    const { history, finderForm } = this.props;
    const [appLabel, modelName] = finderForm.values.type.value.split('.');
    history.push(buildUrl({
      pathname: '/workshop/editor/',
      params: {
        al: appLabel.toLowerCase(),
        mn: modelName.toLowerCase(),
        id,
      },
    }));
  };

  handleCreateItem = () => this.openEditor('new');

  handleEditItem = (e) => {
    e.persist();
    const { id } = e.currentTarget.dataset;
    this.openEditor(id);
  };

  render() {
    // This
    const {
      handleSelectItem, handleCreateItem, handleEditItem, changeInstanceType,
    } = this;

    // State
    const {
      selectedIds,
    } = this.state;

    // Props
    const {
      workshop, toggleDeleteItemModal,
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
                    onKeyUp={this.searchInstances}
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
                    onChange={changeInstanceType}
                    component={renderSelectField}
                    options={workshop.finder.options}
                    className="text-capitalize"
                  />
                </Col>
              </Row>
            </form>

            {/* Item toolbar */}
            <ButtonToolbar>
              <Button color="primary" size="sm" onClick={handleCreateItem}>
                <i className="fal fa-plus" /> Create
              </Button>
              <Button color="success" size="sm" disabled={selectedIds.length === 0}>
                Commit {selectedIds.length !== 0 && <>{selectedIds.length} item{selectedIds.length === 1 ? '' : 's'}</>}
              </Button>
              <Button color="danger" size="sm" disabled={selectedIds.length === 0}>
                Delete {selectedIds.length !== 0 && <>{selectedIds.length} item{selectedIds.length === 1 ? '' : 's'}</>}
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
                      editItem={handleEditItem}
                      toggleDeleteItemModal={toggleDeleteItemModal}
                      selectItem={handleSelectItem}
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
