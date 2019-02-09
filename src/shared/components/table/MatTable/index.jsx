// Absolute Imports
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  UncontrolledTooltip,
} from 'reactstrap';
import classNames from 'classnames';

// Components
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import Checkbox from '@material-ui/core/Checkbox';
import MatTableHead from './MatTableHead';
import userTableCell from '../../../components/UserTableCell';

// Functions
import squashString from '../../../utils/squashString';

const getSorting = (order, orderBy) =>
  (order === 'desc' ? (a, b) => b[orderBy] - a[orderBy] : (a, b) => a[orderBy] - b[orderBy]);


class MatTable extends Component {
  static propTypes = {
    instances: PropTypes.instanceOf(Array),
    instanceCount: PropTypes.number.isRequired,
    tableHeads: PropTypes.instanceOf(Array),
    actions: PropTypes.instanceOf(Object),
    page: PropTypes.number,
    rowsPerPage: PropTypes.number,
    selected: PropTypes.instanceOf(Array).isRequired,

    // Redux
    workshop: PropTypes.instanceOf(Object).isRequired,
    dispatch: PropTypes.func.isRequired,

    // Callbacks
    onSelect: PropTypes.func.isRequired,
    onChangePage: PropTypes.func.isRequired,
    onChangeRowsPerPage: PropTypes.func.isRequired,
  };

  static defaultProps = {
    instances: [],
    tableHeads: [],
    actions: [
      {
        name: '',
        icon: '',
        tooltipContent: '',
        props: {
          className: classNames(''),
          onClick: () => {},
        },
      },
    ],
    page: 0,
    rowsPerPage: 10,
  };

  constructor(props) {
    super(props);
    this.state = {
      order: 'desc',
      orderBy: 'id',
    };
  }

  handleRequestSort = (event, property) => {
    const orderBy = property;
    let order = 'desc';

    if (this.state.orderBy === property && this.state.order === 'desc') { order = 'asc'; }

    this.setState({ order, orderBy });
  };

  handleSelectAllClick = (event, checked) => {
    const { field, onSelect } = this.props;
    const { instances } = field.relatedInstances;
    if (checked) {
      onSelect(instances.map(n => n.id));
      return;
    }
    onSelect([]);
  };

  handleClick = (event, id) => {
    const { selected, onSelect, field } = this.props;
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }

    onSelect(newSelected, field);
  };

  isSelected = id => this.props.selected.indexOf(id) !== -1;

  render() {
    // State
    const {
      order, orderBy,
    } = this.state;

    // Props
    const {
      tableHeads, actions, instances, instanceCount, onChangePage, page, rowsPerPage, selected,
    } = this.props;

    const emptyRows = rowsPerPage - Math.min(rowsPerPage, instanceCount - (page * rowsPerPage));

    return (
      <>
        <div className="material-table__wrap">
          <Table className="material-table">
            <MatTableHead
              rows={tableHeads}
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={this.handleSelectAllClick}
              onRequestSort={this.handleRequestSort}
              rowCount={instances.length}
            />
            <TableBody>
              {instances
                .sort(getSorting(order, orderBy))
                .map((instance) => {
                  const isSelected = this.isSelected(instance.id);

                  return (
                    <TableRow
                      className="material-table__row"
                      role="checkbox"
                      onClick={event => this.handleClick(event, instance.id)}
                      aria-checked={isSelected}
                      tabIndex={-1}
                      key={instance.id}
                      selected={isSelected}
                    >
                      {/* Checkbox column */}
                      <TableCell className="material-table__cell" padding="checkbox">
                        <Checkbox checked={isSelected} className="material-table__checkbox" />
                      </TableCell>

                      {/* ID column */}
                      <TableCell className="material-table__cell">{instance.id}</TableCell>

                      {/* Descriptor columns */}
                      {instance.tableValues.descriptors.map(descriptor => (
                        <TableCell
                          key={descriptor.name}
                          className="material-table__cell"
                          component="th"
                          scope="row"
                          padding="default"
                        >
                          {squashString(descriptor.value, 20)}
                        </TableCell>
                      ))}

                      {/* User column */}
                      <TableCell className="material-table__cell">
                        {userTableCell(instance.tableValues.userEmail, instance.tableValues.userId)}
                      </TableCell>

                      {/* Actions column */}
                      <TableCell className="material-table__cell">
                        {actions.map(action => (
                          <span
                            {...action.props}
                            data-obj={JSON.stringify(instance)}
                            key={action.key(instance.id)}
                          >
                            <i
                              className={action.icon}
                              id={action.id({ name: action.name, id: instance.id })}
                            />
                            <UncontrolledTooltip
                              placement="top"
                              target={action.id({ name: action.name, id: instance.id })}
                            >
                              {action.tooltipContent}
                            </UncontrolledTooltip>
                          </span>
                        ))}
                      </TableCell>
                    </TableRow>
                  );
                })}

              {/* Fill with empty rows */}
              {emptyRows > 0 && (
                <TableRow style={{ height: 49 * emptyRows }}>
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <TablePagination
          component="div"
          className="material-table__pagination"
          count={instanceCount}
          rowsPerPage={rowsPerPage}
          page={page}
          backIconButtonProps={{ 'aria-label': 'Previous Page' }}
          nextIconButtonProps={{ 'aria-label': 'Next Page' }}
          onChangePage={onChangePage}
          onChangeRowsPerPage={this.handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 15]}
        />
      </>
    );
  }
}

export default connect(state => ({
  workshop: state.studio.workshop,
}))(MatTable);
