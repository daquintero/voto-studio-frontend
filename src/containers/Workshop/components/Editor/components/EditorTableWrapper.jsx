// Absolute Imports
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  ButtonToolbar,
  Button,
} from 'reactstrap';

// Actions
import { updateRelatedFields } from '../../../../../redux/actions/workshopActions';
import { UPDATE_RELATED_FIELDS } from '../../../../../redux/actionCreators/workshopActionCreators';

// Components
import Collapse from '../../../../../shared/components/Collapse';
import MatTable from './MatTable';


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
        icon: 'fal fa-fw fa-edit mr-3 text-primary',
        tooltipContent: obj => `Edit ${obj.verboseName}`,
        props: {
          className: 'workshop__form-action',
          onClick: () => {},
        },
      },
      {
        name: 'detail',
        icon: 'fal fa-fw fa-eye mr-3 text-info',
        tooltipContent: obj => `View ${obj.verboseName}`,
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

    dispatch(updateRelatedFields(updateData))
      .then((action) => {
        if (action.type === UPDATE_RELATED_FIELDS.SUCCESS) {
          this.setState(prevState => ({ selected: { ...prevState.selected, [field.name]: [] } }));
        }
      });
  };

  handleOnSelect = (selected, field = null) => {
    this.setState(prevState => ({
      selected: {
        ...prevState.selected,
        [field.fieldName]: selected,
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
          {...this.getTableProps({ field, selected: selected[field.fieldName] })}
          onSelect={this.handleOnSelect}
        />
        <ButtonToolbar>
          <Button
            color="danger"
            disabled={selected[field.fieldName].length === 0}
            onClick={() => this.handleRelatedOnRemove(field)}
          >
            {!action.loading ? (
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
