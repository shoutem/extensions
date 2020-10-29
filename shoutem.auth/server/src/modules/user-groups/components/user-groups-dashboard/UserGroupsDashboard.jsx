import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Button } from 'react-bootstrap';
import i18next from 'i18next';
import autoBindReact from 'auto-bind/react';
import { ConfirmModal, IconLabel } from '@shoutem/react-web-ui';
import { Table } from 'src/components';
import UserGroupModal from '../user-group-modal';
import UserGroupTableRow from '../user-group-table-row';
import LOCALIZATION from './localization';
import './style.scss';

function getUserGroupColumnHeaders() {
  return [
    {
      id: 'name',
      value: i18next.t(LOCALIZATION.HEADER_GROUP_NAME_TITLE),
    },
    {
      id: 'default',
      value: i18next.t(LOCALIZATION.HEADER_DEFAULT_GROUP_TITLE),
      helpText: i18next.t(LOCALIZATION.HEADER_DEFAULT_GROUP_HELP_MESSAGE),
      className: 'table-header__default',
    },
    {
      id: 'actions',
      className: 'table-header__actions',
    },
  ];
}

export default class UserGroupsDashboard extends Component {
  constructor(props) {
    super(props);
    autoBindReact(this);
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
      title: i18next.t(LOCALIZATION.DELETE_MODAL_TITLE),
      message: i18next.t(LOCALIZATION.DELETE_MODAL_MESSAGE, { name }),
      confirmLabel: i18next.t(LOCALIZATION.DELETE_MODAL_BUTTON_CONFIRM_TITLE),
      confirmBsStyle: 'danger',
      abortLabel: i18next.t(LOCALIZATION.DELETE_MODAL_BUTTON_ABORT_TITLE),
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
    const { userGroups, onUserGroupUpdate, onUserGroupCreate } = this.props;

    return (
      <div className="user-groups-dashboard">
        <div className="user-groups-dashboard__title">
          <h3>{i18next.t(LOCALIZATION.TITLE)}</h3>
          <Button
            className="btn-icon pull-right"
            onClick={this.handleCreateUserGroupClick}
          >
            <IconLabel iconName="add">
              {i18next.t(LOCALIZATION.BUTTON_ADD_USER_GROUP_TITLE)}
            </IconLabel>
          </Button>
        </div>
        <Table
          className="user-groups-table"
          emptyPlaceholderText={i18next.t(
            LOCALIZATION.TABLE_EMPTY_PLACEHOLDER_MESSAGE,
          )}
          columnHeaders={getUserGroupColumnHeaders()}
          items={userGroups}
          renderItem={this.renderUserGroupRow}
        />
        <ConfirmModal className="settings-page-modal-small" ref="confirm" />
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
