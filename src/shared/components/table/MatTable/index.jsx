import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Button, ButtonToolbar, Dropdown, DropdownMenu, DropdownItem, DropdownToggle } from 'reactstrap';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import Checkbox from '@material-ui/core/Checkbox';
import MatTableHead from './MatTableHead';
// import MatTableToolbar from './MatTableToolbar';

function getSorting(order, orderBy) {
  return order === 'desc' ? (a, b) => b[orderBy] - a[orderBy] : (a, b) => a[orderBy] - b[orderBy];
}

export default class MatTable extends PureComponent {
  static propTypes = {
    changes: PropTypes.instanceOf(Object).isRequired,
    commitChanges: PropTypes.func.isRequired,
    viewChangeDetail: PropTypes.func.isRequired,
  };

  state = {
    order: 'asc',
    orderBy: 'calories',
    selected: [],
    page: 0,
    rowsPerPage: 10,
    pageName: 'staged',
    dropdownOpen: false,

  };

  toggleDropdown = () => this.setState(prevState => ({ dropdownOpen: !prevState.dropdownOpen }));

  handleRequestSort = (event, property) => {
    const orderBy = property;
    let order = 'desc';

    if (this.state.orderBy === property && this.state.order === 'desc') { order = 'asc'; }

    this.setState({ order, orderBy });
  };

  handleSelectAllClick = (event, checked) => {
    if (checked) {
      this.setState({ selected: this.props.changes[this.state.pageName].map(n => n.id) });
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

  handleDeleteSelected = () => {
    let copyData = [...this.state.data];
    const { selected } = this.state;

    for (let i = 0; i < selected.length; i += 1) {
      copyData = copyData.filter(obj => obj.id !== selected[i]);
    }

    this.setState({ data: copyData, selected: [] });
  };

  isSelected = id => this.state.selected.indexOf(id) !== -1;

  render() {
    const {
      order, orderBy, selected, rowsPerPage, page,
    } = this.state;
    const { changes } = this.props;
    let changeListData;
    switch (this.state.pageName) {
      case 'staged':
        changeListData = changes.staged;
        break;
      case 'committed':
        changeListData = changes.committed;
        break;
      case 'reverted':
        changeListData = changes.reverted;
        break;
      default: return [];
    }
    const emptyRows = rowsPerPage - Math.min(rowsPerPage, changeListData.length - (page * rowsPerPage));

    return (
      <>
        <div className="material-table__wrap">
          <Table className="material-table">
            <MatTableHead
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={this.handleSelectAllClick}
              onRequestSort={this.handleRequestSort}
              rowCount={changeListData.length}
            />
            <TableBody>
              {changeListData
                .sort(getSorting(order, orderBy))
                .slice(page * rowsPerPage, (page * rowsPerPage) + rowsPerPage)
                .map((d) => {
                  const isSelected = this.isSelected(d.id);
                  return (
                    <TableRow
                      className="material-table__row"
                      role="checkbox"
                      onClick={event => this.handleClick(event, d.id)}
                      aria-checked={isSelected}
                      tabIndex={-1}
                      key={d.id}
                      selected={isSelected}
                    >
                      <TableCell className="material-table__cell" padding="checkbox">
                        <Checkbox checked={isSelected} className="material-table__checkbox" />
                      </TableCell>
                      <TableCell className="material-table__cell" numeric>{d.id}</TableCell>
                      <TableCell
                        className="material-table__cell"
                        component="th"
                        scope="row"
                        padding="default"
                      >
                        {d.name}
                      </TableCell>
                      <TableCell className="material-table__cell">{d.date_changed}</TableCell>
                      <TableCell className="material-table__cell">
                        <a href="/">
                          {d.user_email === localStorage.getItem('userEmail') ? <span>You</span> : d.user_email}
                        </a>
                      </TableCell>
                    </TableRow>
                  );
                })}
              {emptyRows > 0 && (
                <TableRow style={{ height: 49 * emptyRows }}>
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <>
          <ButtonToolbar>
            {this.state.selected.length !== 0 && (
              <Button color="success" data-selected={this.state.selected} onClick={this.props.commitChanges}>
                Commit {this.state.selected.length} change{this.state.selected.length === 1 ? '' : 's'}
              </Button>
            )}
            {this.state.selected.length === 1 && (
              <Button color="secondary" data-selected={this.state.selected} onClick={this.props.viewChangeDetail}>
                View details
              </Button>
            )}
            <Dropdown isOpen={this.state.dropdownOpen} toggle={this.toggleDropdown}>
              <DropdownToggle>Status: {this.state.pageName}</DropdownToggle>
              <DropdownMenu>
                <DropdownItem>Staged</DropdownItem>
                <DropdownItem>Committed</DropdownItem>
                <DropdownItem>Reverted</DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </ButtonToolbar>
        </>
        <TablePagination
          component="div"
          className="material-table__pagination"
          count={changeListData.length}
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
