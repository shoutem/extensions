import React, { Component, PropTypes } from 'react';
import { Button } from 'react-bootstrap';
import { ConfirmModal, IconLabel } from '@shoutem/react-web-ui';
import { Table } from 'src/components';
import UserGroupModal from '../user-group-modal';
import UserGroupTableRow from '../user-group-table-row';
import './style.scss';

const USER_GROUP_COLUMN_HEADERS = [
  {
    id: 'name',
    value: 'Group name',
  },
  {
    id: 'default',
    value: 'Default group',
    helpText: 'New users are automatically added to default group',
    className: 'table-header__default',
  },
  {
    id: 'actions',
    className: 'table-header__actions',
  },
];

export default class UserGroupsDashboard extends Component {
  constructor(props) {
    super(props);

    this.handleCreateUserGroupClick = this.handleCreateUserGroupClick.bind(this);
    this.handleRenameUserGroupClick = this.handleRenameUserGroupClick.bind(this);
    this.handleDeleteUserGroupClick = this.handleDeleteUserGroupClick.bind(this);
    this.renderUserGroupRow = this.renderUserGroupRow.bind(this);
  }

  handleCreateUserGroupClick() {
    this.refs.userGroupModal.show();
  }

  handleRenameUserGroupClick(group) {
    this.refs.userGroupModal.show(group);
  }

  handleDeleteUserGroupClick(group) {
    const { id, name } = group;

    this.refs.confirm.show({
      title: 'Delete group',
      message: `Are you sure you want to delete group ${name}?`,
      confirmLabel: 'Delete',
      confirmBsStyle: 'danger',
      onConfirm: () => this.props.onUserGroupDelete(id),
    });
  }

  renderUserGroupRow(userGroup) {
    return (
      <UserGroupTableRow
        key={userGroup.id}
        onDeleteGroupClick={this.handleDeleteUserGroupClick}
        onRenameGroupClick={this.handleRenameUserGroupClick}
        onUpdateGroupClick={this.props.onUserGroupUpdate}
        userGroup={userGroup}
      />
    );
  }

  render() {
    const {
      userGroups,
      onUserGroupUpdate,
      onUserGroupCreate,
    } = this.props;

    return (
      <div className="user-groups-dashboard">
        <div className="user-groups-dashboard__title">
          <h3>Groups</h3>
          <Button
            className="btn-icon pull-right"
            onClick={this.handleCreateUserGroupClick}
          >
            <IconLabel iconName="add">
              Add user group
            </IconLabel>
          </Button>
        </div>
        <Table
          className="user-groups-table"
          emptyPlaceholderText="There are no groups yet."
          columnHeaders={USER_GROUP_COLUMN_HEADERS}
          items={userGroups}
          renderItem={this.renderUserGroupRow}
        />
        <ConfirmModal
          className="settings-page-modal-small"
          ref="confirm"
        />
        <UserGroupModal
          onUserGroupCreate={onUserGroupCreate}
          onUserGroupUpdate={onUserGroupUpdate}
          ref="userGroupModal"
        />
      </div>
    );
  }
}

UserGroupsDashboard.propTypes = {
  userGroups: PropTypes.array,
  onUserGroupDelete: PropTypes.func,
  onUserGroupCreate: PropTypes.func,
  onUserGroupUpdate: PropTypes.func,
};
