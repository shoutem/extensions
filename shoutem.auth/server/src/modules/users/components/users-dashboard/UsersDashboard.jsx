import React, { Component, PropTypes } from 'react';
import { Button } from 'react-bootstrap';
import { ConfirmModal, IconLabel } from '@shoutem/react-web-ui';
import { Table } from 'src/components';
import { createOptions } from 'src/services';
import UserTableRow from '../user-table-row';
import UserModal from '../user-modal';
import './style.scss';

function getUserColumnHeaders(userGroups, filter = {}) {
  const {
    userGroups: userGroupsFilter,
    username: usernameFilter,
  } = filter;

  return [
    {
      id: 'username',
      type: 'input',
      value: usernameFilter,
      placeholder: 'Filter by mail',
      className: 'table-header__username'
    },
    {
      id: 'userGroups',
      type: 'select',
      value: userGroupsFilter,
      options: createOptions(userGroups),
      placeholder: 'Filter by group',
      className: 'table-header__userGroups'
    },
    {
      id: 'status',
      value: 'Status',
      className: 'table-header__status'
    },
    {
      id: 'actions',
      className: 'table-header__actions'
    },
  ];
}

export default class UsersDashboard extends Component {
  constructor(props) {
    super(props);

    this.handleShowUserModal = this.handleShowUserModal.bind(this);
    this.handleAddUserClick = this.handleAddUserClick.bind(this);
    this.handleDeleteUserClick = this.handleDeleteUserClick.bind(this);
    this.renderUserRow = this.renderUserRow.bind(this);
    this.renderUserModal = this.renderUserModal.bind(this);
  }

  handleShowUserModal(user, passwordOnly) {
    this.refs.userModal.show(user, passwordOnly);
  }

  handleAddUserClick() {
    this.refs.userModal.show();
  }

  handleDeleteUserClick(user) {
    const { username, id } = user;
    this.refs.confirm.show({
      title: 'Delete user',
      message: `Are you sure you want to delete ${username}?`,
      confirmLabel: 'Delete',
      confirmBsStyle: 'danger',
      onConfirm: () => this.props.onUserDelete(id),
    });
  }

  renderUserRow(user) {
    const { ownerId, userGroups, onUserUpdate } = this.props;

    return (
      <UserTableRow
        key={user.id}
        onDeleteClick={this.handleDeleteUserClick}
        onEditClick={this.handleShowUserModal}
        onUserUpdate={onUserUpdate}
        ownerId={ownerId}
        user={user}
        userGroups={userGroups}
      />
    );
  }

  renderUserModal() {
    const {
      userGroups,
      ownerId,
      onUserUpdate,
      onUserCreate,
    } = this.props;

    return (
      <UserModal
        onUserCreate={onUserCreate}
        onUserUpdate={onUserUpdate}
        ownerId={ownerId}
        ref="userModal"
        userGroups={userGroups}
      />
    );
  }

  render() {
    const {
      users,
      userGroups,
      filter,
      onFilterChange,
    } = this.props;

    return (
      <div className="users-dashboard">
        <div className="users-dashboard__title">
          <Button
            className="btn-icon pull-right"
            onClick={this.handleAddUserClick}
          >
            <IconLabel iconName="add">
              Add new user
            </IconLabel>
          </Button>
        </div>
        <Table
          className="users-table"
          columnHeaders={getUserColumnHeaders(userGroups, filter)}
          emptyPlaceholderText="No users yet."
          items={users}
          onFilterChange={onFilterChange}
          renderItem={this.renderUserRow}
        />
        <ConfirmModal
          className="settings-page-modal-small"
          ref="confirm"
        />
        {this.renderUserModal()}
      </div>
    );
  }
}

UsersDashboard.propTypes = {
  users: PropTypes.array,
  userGroups: PropTypes.array,
  filter: PropTypes.object,
  onFilterChange: PropTypes.func,
  onUserCreate: PropTypes.func,
  onUserUpdate: PropTypes.func,
  onUserDelete: PropTypes.func,
  ownerId: PropTypes.string,
};
