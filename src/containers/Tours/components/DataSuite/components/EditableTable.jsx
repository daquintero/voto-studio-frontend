import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import EditTable from '../../../../../shared/components/table/EditableTable';

export default class EditableTable extends PureComponent {
  static propTypes = {
    dataSuite: PropTypes.instanceOf(Object).isRequired,
  };

  constructor() {
    super();
    this.heads = [
      {
        key: 'id',
        name: '#',
        width: 80,
      },
      {
        key: 'name',
        name: 'Name',
        editable: true,
      },
      {
        key: 'value',
        name: 'Value',
        editable: true,
      },
    ];
  }

  render() {
    const { openFeature } = this.props.dataSuite.openDataSet;
    return (
      <EditTable heads={this.heads} rows={openFeature.properties} />
    );
  }
}
