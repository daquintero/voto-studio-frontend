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

// Actions
import {
  getRelatedInstanceList,
  updateRelatedFields,
} from '../../../../../../../redux/actions/workshopActions';
import {
  GET_INSTANCE_LIST,
  UPDATE_RELATED_FIELDS,
} from '../../../../../../../redux/actionCreators/workshopActionCreators';

// Components
import MatTable from './MatTable';
import Loader from '../../../../../../../shared/components/Loader/Loader';
import renderSelectField from '../../../../../../../shared/components/form/Select';


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
      selectedIds: [],
    };
  }

  componentDidMount() {
    const { dispatch, workshop } = this.props;

    const relatedModelLabel = workshop.form.relatedFields[0].modelLabel;

    const { fieldName } = workshop.form.relatedFields
      .filter(f => f.modelLabel === relatedModelLabel)[0];

    dispatch(getRelatedInstanceList(
      relatedModelLabel,
      workshop.form.parentModel.modelLabel,
      fieldName,
      workshop.form.parentModel.id,
    ));
  }

  componentWillUnmount() {
    this.isUnmounted = true;
  }

  getFinderOptions = () => {
    const { workshop } = this.props;

    return workshop.form.relatedFields.map(f => f.option);
  };

  changeInstanceType = (selected) => {
    const { dispatch, workshop } = this.props;

    const relatedModelLabel = selected.value;

    const { fieldName } = workshop.form.relatedFields
      .filter(f => f.modelLabel === relatedModelLabel)[0];

    dispatch(getRelatedInstanceList(
      selected.value,
      workshop.form.parentModel.modelLabel,
      fieldName,
      workshop.form.parentModel.id,
    )).then((action) => {
      if (action.type === GET_INSTANCE_LIST.SUCCESS) {
        this.setState({ selectedIds: [] });
      }
    });
  };

  handleSelectItem = (newSelected) => {
    this.setState({ selectedIds: newSelected });
  };

  handleAddItem = () => {
    const { selectedIds } = this.state;
    const { workshop, finderForm, dispatch } = this.props;

    const { fieldName } = workshop.form.relatedFields
      .filter(f => f.modelLabel === finderForm.values.type.value)[0];

    const updateData = {
      modelLabel: workshop.form.parentModel.modelLabel,
      relatedModelLabel: finderForm.values.type.value,
      id: workshop.form.parentModel.id,
      relatedIds: selectedIds,
      updateType: 'add',
      fieldName,
    };

    dispatch(updateRelatedFields(updateData)).then((action) => {
      if (action.type === UPDATE_RELATED_FIELDS.SUCCESS) {
        this.setState({ selectedIds: [] });
      }
      return null;
    });
  };

  render() {
    // This
    const {
      getFinderOptions, handleSelectItem, handleAddItem, handleEditItem, changeInstanceType,
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
                    options={getFinderOptions()}
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
                      editItem={handleEditItem}
                      toggleDeleteItemModal={toggleDeleteItemModal}
                      selectItem={handleSelectItem}
                    />
                  )}
            </div>
          </CardBody>
        </Card>

        {/* Item toolbar */}
        <ButtonToolbar>
          <Button color="primary" size="sm" onClick={handleAddItem} disabled={selectedIds.length === 0}>
            {!workshop.actions.UPDATE_RELATED_FIELDS.loading ? (
              <span><i className="fal fa-plus" /> Add {Boolean(selectedIds.length) && selectedIds.length}</span>
            ) : (
              <span><i className="fal fa-spin fa-spinner" /> Adding...</span>
            )}
          </Button>
          <Button size="sm">Cancel</Button>
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
