// Absolute Imports
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  ButtonToolbar,
  Button,
} from 'reactstrap';

// Actions
import { updateRelatedField } from '../../../../../redux/actions/workshopActions';
import { UPDATE_RELATED_FIELD } from '../../../../../redux/actionCreators/workshopActionCreators';

// Components
import Collapse from '../../../../../shared/components/Collapse';
import MatTable from '../../../../../shared/components/table/MatTable';


class EditorTableWrapper extends Component {
  static propTypes = {
    fields: PropTypes.instanceOf(Array).isRequired,
    action: PropTypes.instanceOf(Object).isRequired,

    // Redux
    workshop: PropTypes.instanceOf(Object).isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      selected: Object.assign({}, ...props.fields.map(f => ({ [f.fieldName]: [] }))),
    };
  }

  getTableProps = props => ({
    ...props,
    actions: [
      {
        name: 'edit',
        id: ({ name, id }) => `${name}-${props.field.modelName}-${id}`,
        icon: 'fal fa-fw fa-edit mr-3 text-primary',
        tooltipContent: `Edit ${props.field.verboseName}`,
        props: {
          className: 'workshop__form-action',
          onClick: () => {},
        },
      },
      {
        name: 'detail',
        id: ({ name, id }) => `${name}-${props.field.modelName}-${id}`,
        icon: 'fal fa-fw fa-eye mr-3 text-info',
        tooltipContent: `View ${props.field.verboseName}`,
        props: {
          className: 'workshop__form-action',
          onClick: () => {},
        },
      },
    ],
  });

  getCollapseTitle = field => `${field.verboseNamePluralTitle} (${field.relatedInstances.instances.length})`;

  handleRelatedOnRemove = (field) => {
    const {
      selected,
    } = this.state;

    const {
      workshop, dispatch,
    } = this.props;

    const updateData = {
      modelLabel: workshop.form.parentModel.modelLabel,
      relatedModelLabel: field.modelLabel,
      id: workshop.form.parentModel.id,
      relatedIds: selected[field.name],
      updateType: 'remove',
      fieldName: field.name,
    };

    dispatch(updateRelatedField(updateData))
      .then((action) => {
        if (action.type === UPDATE_RELATED_FIELD.SUCCESS) {
          this.setState(prevState => ({ selected: { ...prevState.selected, [field.name]: [] } }));
        }
      });
  };

  handleOnSelect = (selected, field = null) => {
    this.setState(prevState => ({
      selected: {
        ...prevState.selected,
        [field.name]: selected,
      },
    }));
  };

  render() {
    // State
    const {
      selected,
    } = this.state;

    // Props
    const {
      fields, action,
    } = this.props;

    return fields.map(field => field.relatedInstances.instances.length !== 0 && (
      <Collapse key={field.fieldName} title={this.getCollapseTitle(field)} className="with-shadow">
        <MatTable
          {...this.getTableProps({ field })}
          instances={field.relatedInstances.instances}
          instanceCount={field.relatedInstances.instances.length}
          tableHeads={field.relatedInstances.tableHeads}
          selected={selected[field.fieldName]}
          onSelect={this.handleOnSelect}
        />
        <ButtonToolbar>
          <Button
            color="danger"
            disabled={selected[field.fieldName].length === 0}
            onClick={() => this.handleRelatedOnRemove(field)}
          >
            {!action[field.fieldName] || !action[field.fieldName].loading ? (
              <span>
                <i className="fal fa-minus" />
                {' Remove '}
                {selected[field.fieldName].length !== 0 && selected[field.fieldName].length}
              </span>
            ) : (
              <span>
                <i className="fal fa-spin fa-spinner" />
                {' Removing...'}
              </span>
            )}
          </Button>
        </ButtonToolbar>
      </Collapse>
    ));
  }
}

export default connect(state => ({
  workshop: state.studio.workshop,
}))(EditorTableWrapper);
