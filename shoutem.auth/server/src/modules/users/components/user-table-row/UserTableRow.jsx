import React, { Component, PropTypes } from 'react';
import _ from 'lodash';
import classNames from 'classnames';
import { MenuItem } from 'react-bootstrap';
import { Dropdown, ActionsMenu, IconLabel } from '@shoutem/react-web-ui';
import { UserGroupsDropdown } from 'src/modules/user-groups';
import './style.scss';

export default class UserTableRow extends Component {
  constructor(props) {
    super(props);

    this.handleStatusChange = this.handleStatusChange.bind(this);
    this.handleChangePasswordClick = this.handleChangePasswordClick.bind(this);
    this.handleDeleteClick = this.handleDeleteClick.bind(this);
    this.handleEditClick = this.handleEditClick.bind(this);
    this.handleUserGroupsChanged = this.handleUserGroupsChanged.bind(this);
  }

  handleStatusChange() {
    const { user: { id: userId, approved }, onUserUpdate } = this.props;
    onUserUpdate(userId, { approved: !approved });
  }

  handleChangePasswordClick() {
    const { user, onEditClick } = this.props;
    onEditClick(user, true);
  }

  handleDeleteClick() {
    const { user, onDeleteClick } = this.props;
    onDeleteClick(user);
  }

  handleEditClick() {
    const { user, onEditClick } = this.props;
    onEditClick(user);
  }

  handleUserGroupsChanged(userGroups) {
    const {
      user: { id: userId },
      onUserUpdate,
    } = this.props;

    return onUserUpdate(userId, { userGroups });
  }

  render() {
    const {
      user,
      ownerId,
      userGroups,
    } = this.props;

    const {
      id,
      username,
      approved,
      userGroups: selectedGroups,
    } = user;

    const isOwner = id === ownerId;
    const selectedUserGroupIds = _.map(selectedGroups, 'id');
    const statusClasses = classNames('user-table-row__status', {
      blocked: !approved,
    });

    const statusLabel = approved ? 'Approved' : 'Blocked';
    const approveActionLabel = approved ? 'Block this user' : 'Approve this user';
    const approveActionIcon = approved ? 'block-user' : 'approve-user';

    return (
      <tr className="user-table-row">
        <td className="text-ellipsis" onClick={this.handleEditClick}>
          {username}
        </td>
        <td>
          <UserGroupsDropdown
            onSelectionChanged={this.handleUserGroupsChanged}
            selectedUserGroupIds={selectedUserGroupIds}
            userGroups={userGroups}
          />
        </td>
        <td className={statusClasses} onClick={this.handleEditClick}>
          {statusLabel}
        </td>
        <td className="user-table-row__actions">
          <ActionsMenu
            className="user-actions-menu pull-right"
            id="user-actions-menu"
          >
            <MenuItem onClick={this.handleEditClick}>
              <IconLabel iconName="edit">
                Edit
              </IconLabel>
            </MenuItem>
            {!isOwner &&
              <MenuItem onClick={this.handleStatusChange}>
                <IconLabel iconName={approveActionIcon}>
                  {approveActionLabel}
                </IconLabel>
              </MenuItem>
            }
            {!isOwner &&
              <MenuItem onClick={this.handleChangePasswordClick}>
                <IconLabel iconName="eyeoff">
                  Change password
                </IconLabel>
              </MenuItem>
            }
            {!isOwner &&
              <MenuItem onClick={this.handleDeleteClick}>
                <IconLabel iconName="delete">
                  Delete
                </IconLabel>
              </MenuItem>
            }
          </ActionsMenu>
        </td>
      </tr>
    );
  }
}

UserTableRow.propTypes = {
  user: PropTypes.object,
  ownerId: PropTypes.string,
  onEditClick: PropTypes.func,
  onDeleteClick: PropTypes.func,
  onUserUpdate: PropTypes.func,
  userGroups: PropTypes.array,
};
