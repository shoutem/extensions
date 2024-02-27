import React, { Component, createRef } from 'react';
import { Button } from 'react-bootstrap';
import autoBindReact from 'auto-bind/react';
import classNames from 'classnames';
import i18next from 'i18next';
import PropTypes from 'prop-types';
import { Table } from 'src/components';
import { createOptions } from 'src/services';
import {
  ConfirmModal,
  FontIcon,
  FontIconPopover,
  IconLabel,
  LoaderContainer,
} from '@shoutem/react-web-ui';
import ChangeRoleModal from '../change-role-modal';
import UserModal from '../user-modal';
import UserTableRow from '../user-table-row';
import LOCALIZATION from './localization';
import './style.scss';

function getUserColumnHeaders(userGroups, filter = {}) {
  const { userGroups: userGroupsFilter, username: usernameFilter } = filter;

  return [
    {
      id: 'username',
      type: 'input',
      value: usernameFilter,
      placeholder: i18next.t(LOCALIZATION.HEADER_FILTER_BY_EMAIL_TITLE),
      className: 'table-header__username',
    },
    {
      id: 'userGroups',
      type: 'select',
      value: userGroupsFilter,
      options: createOptions(userGroups),
      placeholder: i18next.t(LOCALIZATION.HEADER_FILTER_BY_GROUP_TITLE),
      className: 'table-header__userGroups',
    },
    {
      id: 'status',
      value: i18next.t(LOCALIZATION.HEADER_STATUS_TITLE),
      className: 'table-header__status',
    },
    {
      id: 'actions',
      className: 'table-header__actions',
    },
  ];
}

export default class UsersDashboard extends Component {
  constructor(props) {
    super(props);
    autoBindReact(this);

    this.confirmModalRef = createRef();
    this.userModalRef = createRef();
    this.changeRoleModalRef = createRef();

    this.state = {
      downloading: false,
    };
  }

  handleShowUserModal(user, passwordOnly) {
    this.userModalRef.current.show(user, passwordOnly);
  }

  handleAddUserClick() {
    this.userModalRef.current.show();
  }

  handleShowChangeRoleModal(user) {
    this.changeRoleModalRef.current.show(user);
  }

  handleDeleteUserClick(user) {
    const { onUserDelete } = this.props;
    const { username, id } = user;

    this.confirmModalRef.current.show({
      title: i18next.t(LOCALIZATION.DELETE_MODAL_USER_TITLE),
      message: i18next.t(LOCALIZATION.DELETE_USER_MODAL_MESSAGE, { username }),
      confirmLabel: i18next.t(
        LOCALIZATION.DELETE_USER_MODAL_BUTTON_CONFIRM_TITLE,
      ),
      confirmBsStyle: 'danger',
      abortLabel: i18next.t(LOCALIZATION.DELETE_USER_MODAL_BUTTON_ABORT_TITLE),
      onConfirm: () => onUserDelete(id),
    });
  }

  handleDownloadUserData() {
    const { onUserDataDownload, appId } = this.props;

    this.setState({ downloading: true });

    onUserDataDownload()
      .then(response => response.blob())
      .then(usersDataBlob => {
        setTimeout(() => {
          this.setState({ downloading: false });
        }, 500);

        const blobUrl = URL.createObjectURL(usersDataBlob);
        const fileName = `${appId}-users-${Date.now()}`;

        const link = document.createElement('a');
        link.setAttribute('href', blobUrl);
        link.setAttribute('download', fileName);

        document.body.appendChild(link);

        link.click();

        // Remove references
        document.body.removeChild(link);
        URL.revokeObjectURL(blobUrl);
      })
      .catch(() => this.setState({ downloading: false }));
  }

  renderUserRow(user) {
    const { ownerId, userGroups, onUserUpdate } = this.props;

    return (
      <UserTableRow
        key={user.id}
        onDeleteClick={this.handleDeleteUserClick}
        onEditClick={this.handleShowUserModal}
        onChangeRoleClick={this.handleShowChangeRoleModal}
        onUserUpdate={onUserUpdate}
        ownerId={ownerId}
        user={user}
        userGroups={userGroups}
      />
    );
  }

  render() {
    const { downloading } = this.state;
    const {
      users,
      ownerId,
      userGroups,
      filter,
      onFilterChange,
      onUserChangeRole,
      onUserUpdate,
      onUserCreate,
      onUserChangePassword,
    } = this.props;

    const classes = classNames('download-button', {
      'button-cursor': !downloading,
    });

    return (
      <div className="users-dashboard">
        <div className="users-dashboard__header">
          <div className="users-dashboard__title_container">
            <span className="users-dashboard__title">
              {i18next.t(LOCALIZATION.USERS_TABLE_TITLE)}
            </span>
            <LoaderContainer className={classes} isLoading={downloading}>
              <FontIconPopover
                onClick={this.handleDownloadUserData}
                hideOnMouseLeave
                message={i18next.t(LOCALIZATION.EXPORT_POPOVER_MESSAGE)}
              >
                <FontIcon name="download" size="24px" />
              </FontIconPopover>
            </LoaderContainer>
          </div>

          <Button
            className="btn-icon pull-right"
            onClick={this.handleAddUserClick}
          >
            <IconLabel iconName="add">
              {i18next.t(LOCALIZATION.BUTTON_ADD_NEW_USER_TITLE)}
            </IconLabel>
          </Button>
        </div>
        <Table
          className="users-table"
          columnHeaders={getUserColumnHeaders(userGroups, filter)}
          emptyPlaceholderText={i18next.t(
            LOCALIZATION.TABLE_EMPTY_PLACEHOLDER_MESSAGE,
          )}
          items={users}
          onFilterChange={onFilterChange}
          renderItem={this.renderUserRow}
        />
        <ConfirmModal
          className="settings-page-modal-small"
          ref={this.confirmModalRef}
        />
        <ChangeRoleModal
          ref={this.changeRoleModalRef}
          onUserChangeRole={onUserChangeRole}
        />
        <UserModal
          ref={this.userModalRef}
          ownerId={ownerId}
          userGroups={userGroups}
          onUserCreate={onUserCreate}
          onUserUpdate={onUserUpdate}
          onUserChangePassword={onUserChangePassword}
        />
      </div>
    );
  }
}

UsersDashboard.propTypes = {
  appId: PropTypes.string.isRequired,
  filter: PropTypes.object.isRequired,
  ownerId: PropTypes.string.isRequired,
  userGroups: PropTypes.array.isRequired,
  users: PropTypes.array.isRequired,
  onFilterChange: PropTypes.func.isRequired,
  onUserChangePassword: PropTypes.func.isRequired,
  onUserChangeRole: PropTypes.func.isRequired,
  onUserCreate: PropTypes.func.isRequired,
  onUserDataDownload: PropTypes.func.isRequired,
  onUserDelete: PropTypes.func.isRequired,
  onUserUpdate: PropTypes.func.isRequired,
};
