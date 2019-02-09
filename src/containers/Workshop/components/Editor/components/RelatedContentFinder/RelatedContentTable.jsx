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
  updateRelatedField,
} from '../../../../../../redux/actions/workshopActions';
import {
  GET_INSTANCE_LIST,
  TOGGLE_RELATED_CONTENT_FINDER,
  UPDATE_RELATED_FIELD,
} from '../../../../../../redux/actionCreators/workshopActionCreators';

// Components
import MatTable from '../../../../../../shared/components/table/MatTable/index';
import Loader from '../../../../../../shared/components/Loader/Loader';
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

  getTableProps = props => ({
    ...props,
    actions: [
      {
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
        this.setState({ selected: [] });
      }
    });
  };

  handleOnSelect = (newSelected) => {
    this.setState({ selected: newSelected });
  };

  handleAddItem = () => {
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
    };

    dispatch(updateRelatedField(updateData)).then((action) => {
      if (action.type === UPDATE_RELATED_FIELD.SUCCESS) {
        this.setState({ selected: [] });
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
      selected,
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
                    // onKeyUp={this.searchInstances}
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
                      tableHeads={workshop.openList.tableHeads}
                      onSelect={this.handleOnSelect}
                    />
                  )}
            </div>
          </CardBody>
        </Card>

        {/* Item toolbar */}
        <ButtonToolbar>
          <Button color="primary" size="sm" onClick={this.handleAddItem} disabled={selected.length === 0}>
            {!workshop.actions.UPDATE_RELATED_FIELD.loading ? (
              <span><i className="fal fa-plus" /> Add {Boolean(selected.length) && selected.length}</span>
            ) : (
              <span><i className="fal fa-spin fa-spinner" /> Adding...</span>
            )}
          </Button>
          <Button size="sm" onClick={this.handleToggleRelatedContentFinder}>
            Cancel
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
