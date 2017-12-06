import React, { Component, PropTypes } from 'react';
import _ from 'lodash';
import { InlineModal } from '@shoutem/react-web-ui';
import UserForm from '../user-form';

export default class UserModal extends Component {
  constructor(props) {
    super(props);

    this.show = this.show.bind(this);
    this.handleHide = this.handleHide.bind(this);
    this.handleUserFormSubmit = this.handleUserFormSubmit.bind(this);

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
    const { currentUser } = this.state;
    if (currentUser) {
      return this.props.onUserUpdate(currentUser.id, user)
        .then(this.handleHide);
    }

    return this.props.onUserCreate(user)
      .then(this.handleHide);
  }

  render() {
    const { ownerId, userGroups } = this.props;
    const { show, passwordOnly, currentUser } = this.state;

    const currentUserId = _.get(currentUser, 'id');
    const currentUserProfile = _.get(currentUser, 'profile', {});
    const currentUsername = _.get(currentUser, 'username');
    const currentUserGroups = _.get(currentUser, 'userGroups', []);

    const modalTitle = currentUserId ? 'Edit app user' : 'Add app user';
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
};
