import PropTypes from 'prop-types';
import React, { Component } from 'react';
import _ from 'lodash';
import classNames from 'classnames';
import autoBindReact from 'auto-bind/react';
import i18next from 'i18next';
import { MenuItem } from 'react-bootstrap';
import { ActionsMenu, IconLabel } from '@shoutem/react-web-ui';
import { UserGroupsDropdown } from 'src/modules/user-groups';
import LOCALIZATION from './localization';
import './style.scss';

export default class UserTableRow extends Component {
  constructor(props) {
    super(props);
    autoBindReact(this);
  }

  handleStatusChange() {
    const {
      user: { id: userId, approved },
      onUserUpdate,
    } = this.props;
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
    const { user, ownerId, userGroups } = this.props;

    const { id, username, approved, userGroups: selectedGroups } = user;

    const isOwner = id === ownerId;
    const selectedUserGroupIds = _.map(selectedGroups, 'id');
    const statusClasses = classNames('user-table-row__status', {
      blocked: !approved,
    });

    const statusLabel = approved
      ? i18next.t(LOCALIZATION.STATUS_APPROVED_TITLE)
      : i18next.t(LOCALIZATION.STATUS_BLOCKED_TITLE);
    const approveActionLabel = approved
      ? i18next.t(LOCALIZATION.BUTTON_BLOCK_USER_TITLE)
      : i18next.t(LOCALIZATION.BUTTON_APPROVED_USER_TITLE);
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
                {i18next.t(LOCALIZATION.BUTTON_EDIT_TITLE)}
              </IconLabel>
            </MenuItem>
            {!isOwner && (
              <MenuItem onClick={this.handleStatusChange}>
                <IconLabel iconName={approveActionIcon}>
                  {approveActionLabel}
                </IconLabel>
              </MenuItem>
            )}
            {!isOwner && (
              <MenuItem onClick={this.handleChangePasswordClick}>
                <IconLabel iconName="eyeoff">
                  {i18next.t(LOCALIZATION.BUTTON_CHANGE_PASSWORD_TITLE)}
                </IconLabel>
              </MenuItem>
            )}
            {!isOwner && (
              <MenuItem onClick={this.handleDeleteClick}>
                <IconLabel iconName="delete">
                  {i18next.t(LOCALIZATION.BUTTON_DELETE_TITLE)}
                </IconLabel>
              </MenuItem>
            )}
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
