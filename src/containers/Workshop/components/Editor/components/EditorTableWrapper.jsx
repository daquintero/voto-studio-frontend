// Absolute Imports
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  ButtonToolbar,
  Button,
} from 'reactstrap';
import TableCell from '@material-ui/core/TableCell';
import { toast } from 'react-toastify';
import { withTranslation } from 'react-i18next';

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
        key: id => `edit-${id}`,
        name: 'edit',
        id: ({ name, id }) => `${name}-${props.field.modelName}-${id}`,
        icon: () => 'fal fa-fw fa-edit mr-3 text-primary',
        tooltipContent: () => `Edit ${props.field.verboseName}`,
        props: {
          className: 'workshop__form-action',
          onClick: () => {},
        },
      },
      {
        key: id => `detail-${id}`,
        name: 'detail',
        id: ({ name, id }) => `${name}-${props.field.modelName}-${id}`,
        icon: () => 'fal fa-fw fa-eye mr-3 text-info',
        tooltipContent: () => `View ${props.field.verboseName}`,
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
        const relatedModelName = field.modelName;
        if (action.type === UPDATE_RELATED_FIELD.SUCCESS) {
          this.setState(prevState => ({
            selected: {
              ...prevState.selected,
              [field.name]: [],
            },
          }));
          // TODO Translation interpolation
          toast(`Successfully removed ${relatedModelName} instance(s) with ID(s): ${selected[field.name]}`, {
            toastId: workshop.form.parentModel.id,
          });
        }
        // TODO Translation interpolation
        if (action.type === UPDATE_RELATED_FIELD.ERROR) {
          toast(`Failed to remove ${relatedModelName} instance(s) with ID(s): ${selected[field.name]}`, {
            toastId: workshop.form.parentModel.id,
          });
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

  renderRelLevelColumn = (instance, field) => (
    <TableCell className="material-table__cell">
      {field.relsDict.rels.includes(instance.id) ? 'Rel' : 'Ref'}
    </TableCell>
  );

  render() {
    // State
    const {
      selected,
    } = this.state;

    // Props
    const {
      fields, action, t,
    } = this.props;

    const getTableHeads = field => ([
      ...field.relatedInstances.tableHeads,
      {
        id: 'relLevel', numeric: false, disablePadding: false, label: 'Ref/Rel',
      },
    ]);

    return fields.map(field => field.relatedInstances.instances.length !== 0 && (
      <Collapse key={field.fieldName} title={this.getCollapseTitle(field)} className="with-shadow">
        <MatTable
          {...this.getTableProps({ field })}
          instances={field.relatedInstances.instances}
          instanceCount={field.relatedInstances.instances.length}
          tableHeads={getTableHeads(field)}
          selected={selected[field.fieldName]}
          onSelect={this.handleOnSelect}
          renderRelLevelColumn={instance => this.renderRelLevelColumn(instance, field)}
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
                {t(' Remove ')}
                {selected[field.fieldName].length !== 0 && selected[field.fieldName].length}
              </span>
            ) : (
              <span>
                <i className="fal fa-spin fa-spinner" />
                {t(' Removing...')}
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
}))(withTranslation()(EditorTableWrapper));
