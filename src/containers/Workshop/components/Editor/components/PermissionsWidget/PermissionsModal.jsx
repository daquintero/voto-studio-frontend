// Absolute Imports
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Modal, Table } from 'reactstrap';

// Actions
import { LIST_USERS } from '../../../../../../redux/actionCreators/userActionCreators';
import { getUserList, updateUserPermission } from '../../../../../../redux/actions/userActions';

// Components
import Loader from '../../../../../../shared/components/Loader';


class PermissionsModal extends PureComponent {
  static propTypes = {
    isOpen: PropTypes.bool.isRequired,
    toggle: PropTypes.func.isRequired,

    // Redux
    dispatch: PropTypes.func.isRequired,
    workshop: PropTypes.instanceOf(Object).isRequired,
    auth: PropTypes.instanceOf(Object).isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      searchTerm: '',
    };
    this.permissionLevels = {
      write: 'write',
      read: 'read',
    };
  }

  handleOnClosed = () => {
    this.setState({
      searchTerm: '',
    });
    this.props.dispatch({
      type: LIST_USERS.INIT,
    });
  };

  handleOnChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleSearchInstances = (e) => {
    e.persist();
    const { timeout } = this.state;
    const { dispatch } = this.props;

    if (timeout) {
      clearTimeout(timeout);
    }

    this.setState({
      timeout: setTimeout(() => {
        dispatch(getUserList(e.target.value));
      }, 600),
    });
  };

  handleOnUpdate = (e, updateType) => {
    e.persist();

    const {
      dispatch, workshop,
    } = this.props;

    const { id } = e.target.dataset;
    const permissionLevel = this.state[`${id}-permission`];

    dispatch(updateUserPermission({
      modelLabel: workshop.form.parentModel.modelLabel,
      instanceId: workshop.form.parentModel.id,
      permissionLevel: permissionLevel === undefined ? this.permissionLevels.write : permissionLevel,
      userId: id,
      updateType,
    }));
  };

  render() {
    // State
    const {
      searchTerm,
    } = this.state;

    // Props
    const {
      isOpen, toggle, auth,
    } = this.props;

    return (
      <div>
        <Modal
          isOpen={isOpen}
          toggle={toggle}
          onClosed={this.handleOnClosed}
          size="lg"
        >
          <div className="modal__header">
            <button className="lnr lnr-cross modal__close-btn" onClick={toggle} />
            <h4 className="bold-text  modal__title">Share Access</h4>
            <h4 className="subhead">
              {'"'}Read{'"'} is the lowest permission level. {'"'}Write{'"'} is the highest permission level.
            </h4>
          </div>
          <div className="modal__body">
            <Table className="permissions-modal__table">
              <tbody>
                {auth.permittedUsers.map((user) => {
                  const isOwner = auth.owner.email === user.email;
                  const permission = isOwner ? 'Owner' : auth.permissionsDict[user.id];
                  return (
                    <tr>
                      <td><img src={user.profilePictureUrl} alt="" /></td>
                      <td>{user.name}</td>
                      <td><Link to={`/accounts/profile/${user.id}`}>{user.email}</Link></td>
                      <td className="text-capitalize">{permission}</td>
                      <td>
                        {!isOwner && (
                          <button
                            className="fal fa-times remove-btn"
                            style={{ backgroundColor: 'transparent', border: 'none' }}
                            onClick={e => this.handleOnUpdate(e, 'revoke')}
                            data-id={user.id}
                          />
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
            <form className="form">
              <div className="form__form-group">
                <div className="form__form-group-field">
                  <input
                    name="searchTerm"
                    value={searchTerm}
                    onChange={this.handleOnChange}
                    onKeyUp={this.handleSearchInstances}
                    className="w-100"
                    placeholder="Search for users..."
                  />
                </div>
              </div>
            </form>
            {!auth.actions.LIST_USERS.loading ? (
              <>
                {auth.userList && auth.userList.length ? (
                  <Table className="permissions-modal__table">
                    {auth.userList.map(user => (
                      <tbody>
                        <tr>
                          <td><img src={user.profilePictureUrl} alt="" /></td>
                          <td>{user.name}</td>
                          <td><Link to={`/accounts/profile/${user.id}`}>{user.email}</Link></td>
                          <td>
                            <form className="form" style={{ maxHeight: 32 }}>
                              <div className="form__form-group">
                                <div className="form__form-group-field">
                                  <select
                                    name={`${user.id}-permission`}
                                    className="form__form-group-select"
                                    onChange={this.handleOnChange}
                                  >
                                    <option value={this.permissionLevels.write}>Edit</option>
                                    <option value={this.permissionLevels.read}>Read only</option>
                                  </select>
                                </div>
                              </div>
                            </form>
                          </td>
                          <td>
                            <button
                              className="fal fa-plus add-btn"
                              style={{ backgroundColor: 'transparent', border: 'none' }}
                              onClick={e => this.handleOnUpdate(e, 'permit')}
                              data-id={user.id}
                            />
                          </td>
                        </tr>
                      </tbody>
                ))}
                  </Table>
                ) : (
                  <p>No users found.</p>
                )}
                </>
            ) : (
              <Loader elemClass="load__card" />
            )}
          </div>
        </Modal>
      </div>
    );
  }
}

export default connect(state => ({
  workshop: state.studio.workshop,
  auth: state.auth,
}))(PermissionsModal);
