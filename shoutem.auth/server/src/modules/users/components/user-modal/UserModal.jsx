import PropTypes from 'prop-types';
import React, { Component } from 'react';
import _ from 'lodash';
import autoBindReact from 'auto-bind/react';
import i18next from 'i18next';
import { InlineModal } from '@shoutem/react-web-ui';
import UserForm from '../user-form';
import LOCALIZATION from './localization';

export default class UserModal extends Component {
  constructor(props) {
    super(props);
    autoBindReact(this);

    this.state = {
      show: false,
      currentUser: null,
      passwordOnly: false,
    };
  }

  show(currentUser, passwordOnly = false) {
    this.setState({
      show: true,
      currentUser,
      passwordOnly,
    });
  }

  handleHide() {
    this.setState({
      show: false,
      currentUser: null,
      passwordOnly: false,
    });
  }

  handleUserFormSubmit(user) {
    const { onUserUpdate, onUserChangePassword, onUserCreate } = this.props;
    const { currentUser, passwordOnly } = this.state;

    if (currentUser) {
      if (passwordOnly) {
        const password = _.get(user, 'password');
        return onUserChangePassword(currentUser.id, password).then(
          this.handleHide,
        );
      }

      return onUserUpdate(currentUser.id, user).then(this.handleHide);
    }

    return onUserCreate(user).then(this.handleHide);
  }

  render() {
    const { ownerId, userGroups } = this.props;
    const { show, passwordOnly, currentUser } = this.state;

    const currentUserId = _.get(currentUser, 'id');
    const currentUserProfile = _.get(currentUser, 'profile', {});
    const currentUsername = _.get(currentUser, 'username');
    const currentUserGroups = _.get(currentUser, 'userGroups', []);

    const modalTitle = currentUserId
      ? i18next.t(LOCALIZATION.EDIT_APP_USER_TITLE)
      : i18next.t(LOCALIZATION.ADD_APP_USER_TITLE);
    const isOwner = currentUser && currentUserId === ownerId;

    const initialValues = {
      id: currentUserId,
      username: currentUsername,
      userGroups: _.map(currentUserGroups, 'id'),
      ...currentUserProfile,
    };

    return (
      <InlineModal
        className="settings-page-modal user-modal"
        onHide={this.handleHide}
        show={show}
        title={modalTitle}
      >
        <UserForm
          canChangeUsername={!isOwner}
          initialValues={initialValues}
          onCancel={this.handleHide}
          onSubmit={this.handleUserFormSubmit}
          passwordOnly={passwordOnly}
          userGroups={userGroups}
        />
      </InlineModal>
    );
  }
}

UserModal.propTypes = {
  ownerId: PropTypes.string,
  userGroups: PropTypes.array,
  onUserUpdate: PropTypes.func,
  onUserCreate: PropTypes.func,
  onUserChangePassword: PropTypes.func,
};
