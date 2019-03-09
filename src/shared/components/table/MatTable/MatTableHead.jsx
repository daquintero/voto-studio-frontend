import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import TableHead from '@material-ui/core/TableHead';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Checkbox from '@material-ui/core/Checkbox';
import TableSortLabel from '@material-ui/core/TableSortLabel';


export default class MatTableHead extends PureComponent {
  static propTypes = {
    rows: PropTypes.instanceOf(Array).isRequired,
    numSelected: PropTypes.number.isRequired,
    onRequestSort: PropTypes.func.isRequired,
    onSelectAll: PropTypes.func.isRequired,
    order: PropTypes.string.isRequired,
    orderBy: PropTypes.string.isRequired,
    rowCount: PropTypes.number.isRequired,
  };

  createSortHandler = property => (event) => {
    this.props.onRequestSort(event, property);
  };

  render() {
    const {
      rows, onSelectAll, order, orderBy, numSelected, rowCount,
    } = this.props;

    const rowsWithExtra = [
      {
        id: 'id', numeric: false, disablePadding: false, label: 'ID',
      },
      {
        id: 'actions', numeric: false, disablePadding: false, label: 'Actions',
      },
      ...rows,
      {
        id: 'published', numeric: false, disablePadding: false, label: 'Published',
      },
      {
        id: 'user', numeric: false, disablePadding: false, label: 'User',
      },
    ];

    return (
      <TableHead>
        <TableRow>
          <TableCell padding="checkbox">
            <Checkbox
              className={`material-table__checkbox ${numSelected === rowCount && 'material-table__checkbox--checked'}`}
              indeterminate={numSelected > 0 && numSelected < rowCount}
              checked={numSelected === rowCount}
              onChange={onSelectAll}
            />
          </TableCell>
          {rowsWithExtra.map(row => (
            <TableCell
              className="material-table__cell material-table__cell--sort"
              key={row.id}
              numeric={row.numeric}
              padding={row.disablePadding ? 'none' : 'default'}
              sortDirection={orderBy === row.id ? order : false}
            >
              <TableSortLabel
                active={orderBy === row.id}
                direction={order}
                onClick={this.createSortHandler(row.id)}
                className="material-table__sort-label"
              >
                {row.label}
              </TableSortLabel>
            </TableCell>
            ), this)}
        </TableRow>
      </TableHead>
    );
  }
}
