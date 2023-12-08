import React, { Component } from 'react';
import autoBindReact from 'auto-bind/react';
import i18next from 'i18next';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { InlineModal } from '@shoutem/react-web-ui';
import { USER_APP_ROLES } from '../../const';
import ChangeRoleForm from '../change-role-form';
import LOCALIZATION from './localization';

export default class ChangeRoleModal extends Component {
  constructor(props) {
    super(props);
    autoBindReact(this);

    this.state = {
      show: false,
      currentUser: null,
    };
  }

  show(currentUser) {
    this.setState({
      show: true,
      currentUser,
    });
  }

  handleHide() {
    this.setState({
      show: false,
      currentUser: null,
    });
  }

  async handleChangeRoleSubmit(role) {
    const { onUserChangeRole } = this.props;
    const { currentUser } = this.state;

    if (_.isFunction(onUserChangeRole) && currentUser && role) {
      await onUserChangeRole(currentUser.id, role);
    }

    this.handleHide();
  }

  render() {
    const { show, currentUser } = this.state;
    const currentUserRole = _.get(
      currentUser,
      'profile.appRole',
      USER_APP_ROLES.USER,
    );

    return (
      <InlineModal
        className="settings-page-modal change-role-modal"
        onHide={this.handleHide}
        show={show}
        title={i18next.t(LOCALIZATION.TITLE)}
      >
        <ChangeRoleForm
          role={currentUserRole}
          onCancel={this.handleHide}
          onSubmit={this.handleChangeRoleSubmit}
        />
      </InlineModal>
    );
  }
}

ChangeRoleModal.propTypes = {
  onUserChangeRole: PropTypes.func.isRequired,
};
