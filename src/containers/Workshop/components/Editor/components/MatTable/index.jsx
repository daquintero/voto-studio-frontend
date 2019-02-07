// Absolute Imports
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  UncontrolledTooltip,
  ButtonToolbar,
  Button,
} from 'reactstrap';

// Components
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import Checkbox from '@material-ui/core/Checkbox';
import MatTableHead from './MatTableHead';
import userTableCell from '../../../../../../shared/components/UserTableCell';

// Functions
import squashString from '../../../../../../shared/utils/squashString';

// Actions
import { updateRelatedFields } from '../../../../../../redux/actions/workshopActions';
import { UPDATE_RELATED_FIELDS } from '../../../../../../redux/actionCreators/workshopActionCreators';

const getSorting = (order, orderBy) =>
  (order === 'desc' ? (a, b) => b[orderBy] - a[orderBy] : (a, b) => a[orderBy] - b[orderBy]);


class MatTable extends Component {
  static propTypes = {
    field: PropTypes.instanceOf(Object).isRequired,

    // Redux
    workshop: PropTypes.instanceOf(Object).isRequired,
    dispatch: PropTypes.func.isRequired,

    // Callbacks
    editItem: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      order: 'asc',
      orderBy: 'calories',
      selected: [],
      page: 0,
      rowsPerPage: 5,
    };
  }

  handleRequestSort = (event, property) => {
    const orderBy = property;
    let order = 'desc';

    if (this.state.orderBy === property && this.state.order === 'desc') { order = 'asc'; }

    this.setState({ order, orderBy });
  };

  handleSelectAllClick = (event, checked) => {
    const { field } = this.props;
    const { instances } = field.relatedInstances;
    if (checked) {
      this.setState({ selected: instances.map(n => n.id) });
      return;
    }
    this.setState({ selected: [] });
  };

  handleClick = (event, id) => {
    const { selected } = this.state;
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

    this.setState({ selected: newSelected });
  };

  handleChangePage = (event, page) => {
    this.setState({ page });
  };

  handleChangeRowsPerPage = (event) => {
    this.setState({ rowsPerPage: event.target.value });
  };

  handleRemoveItem = () => {
    const { selected } = this.state;
    const {
      workshop, dispatch, field,
    } = this.props;

    const updateData = {
      modelLabel: workshop.form.parentModel.modelLabel,
      relatedModelLabel: field.modelLabel,
      id: workshop.form.parentModel.id,
      relatedIds: selected,
      updateType: 'remove',
      fieldName: field.name,
    };

    dispatch(updateRelatedFields(updateData)).then((action) => {
      if (action.type === UPDATE_RELATED_FIELDS.SUCCESS) {
        this.setState({ selected: [] });
      }
      return null;
    });
  };

  isSelected = id => this.state.selected.indexOf(id) !== -1;

  render() {
    // State
    const {
      order, orderBy, selected, rowsPerPage, page,
    } = this.state;

    // Props
    const {
      field, editItem, workshop,
    } = this.props;

    // Redux
    const {
      verboseName, modelName, relatedInstances,
    } = field;
    const {
      instances, tableHeads,
    } = relatedInstances;

    const emptyRows = rowsPerPage - Math.min(rowsPerPage, instances.length - (page * rowsPerPage));

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
                .slice(page * rowsPerPage, (page * rowsPerPage) + rowsPerPage)
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
                        <span
                          className="workshop__form-action"
                          role="presentation"
                          data-obj={JSON.stringify(instance)}
                          onClick={editItem}
                          data-id={instance.id}
                        >
                          <i
                            className="fal fa-fw fa-edit mr-3 text-primary"
                            id={`edit-${modelName}-${instance.tableValues.id}`}
                          />
                        </span>
                        <span
                          className="workshop__form-action"
                          role="presentation"
                          data-obj={JSON.stringify(instance)}
                          onClick={this.handleViewItem}
                        >
                          <i
                            className="fal fa-fw fa-eye mr-3 text-info"
                            id={`details-${modelName}-${instance.tableValues.id}`}
                          />
                        </span>

                        {/* Tooltips */}
                        <UncontrolledTooltip
                          placement="top"
                          target={`edit-${modelName}-${instance.tableValues.id}`}
                        >
                            Edit {verboseName}
                        </UncontrolledTooltip>
                        <UncontrolledTooltip
                          placement="top"
                          target={`details-${modelName}-${instance.tableValues.id}`}
                        >
                            View {verboseName}
                        </UncontrolledTooltip>
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
        <ButtonToolbar>
          <Button color="danger" disabled={selected.length === 0} onClick={this.handleRemoveItem}>
            {!workshop.actions.UPDATE_RELATED_FIELDS.loading ? (
              <span><i className="fal fa-minus" /> Remove {selected.length !== 0 && selected.length}</span>
            ) : (
              <span><i className="fal fa-spin fa-spinner" /> Removing...</span>
            )}
          </Button>
        </ButtonToolbar>
        <TablePagination
          component="div"
          className="material-table__pagination"
          count={instances.length}
          rowsPerPage={rowsPerPage}
          page={page}
          backIconButtonProps={{ 'aria-label': 'Previous Page' }}
          nextIconButtonProps={{ 'aria-label': 'Next Page' }}
          onChangePage={this.handleChangePage}
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
