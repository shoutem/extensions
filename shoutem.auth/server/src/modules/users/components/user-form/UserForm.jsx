import PropTypes from 'prop-types';
import React, { Component } from 'react';
import _ from 'lodash';
import autoBindReact from 'auto-bind/react';
import i18next from 'i18next';
import { reduxForm } from 'redux-form';
import { Row, Button, ButtonToolbar, HelpBlock } from 'react-bootstrap';
import { LoaderContainer, ReduxFormElement } from '@shoutem/react-web-ui';
import { getFormState } from 'src/redux';
import { UserGroupsDropdown } from 'src/modules/user-groups';
import { validateUser } from '../../services';
import GeneratedPasswordControl from '../generated-password-control';
import LOCALIZATION from './localization';
import './style.scss';

export class UserForm extends Component {
  constructor(props) {
    super(props);
    autoBindReact(this);
  }

  handlePasswordGenerated(newPassword) {
    const {
      fields: { password },
    } = this.props;
    password.onChange(newPassword);
  }

  handleUserGroupsChange(newUserGroups) {
    const {
      fields: { userGroups },
    } = this.props;
    userGroups.onChange(newUserGroups);
  }

  render() {
    const {
      submitting,
      pristine,
      fields: {
        id,
        name,
        username,
        password,
        nick,
        userGroups: selectedUserGroups,
      },
      onCancel,
      handleSubmit,
      error,
      passwordOnly,
      canChangeUsername,
      userGroups,
    } = this.props;

    const inEditMode = !_.isEmpty(id.value);
    const showPasswordField = passwordOnly || !inEditMode;
    const showUserGroups = !inEditMode;

    return (
      <form className="user-form" onSubmit={handleSubmit}>
        {!passwordOnly && (
          <Row>
            <ReduxFormElement
              disabled={submitting || !canChangeUsername}
              elementId="nick"
              field={nick}
              name={i18next.t(LOCALIZATION.FORM_USERNAME_TITLE)}
            />
          </Row>
        )}
        {!passwordOnly && (
          <Row>
            <ReduxFormElement
              disabled={submitting}
              elementId="name"
              field={name}
              name={i18next.t(LOCALIZATION.FORM_NAME_SURNAME_TITLE)}
            />
          </Row>
        )}
        {!passwordOnly && (
          <Row>
            <ReduxFormElement
              disabled={submitting || inEditMode}
              elementId="username"
              field={username}
              name={i18next.t(LOCALIZATION.FORM_EMAIL_TITLE)}
            />
          </Row>
        )}
        {showPasswordField && (
          <Row>
            <GeneratedPasswordControl
              disabled={submitting}
              field={password}
              name={i18next.t(LOCALIZATION.FORM_PASSWORD_TITLE)}
              onPasswordUpdated={this.handlePasswordGenerated}
              password={password}
            />
          </Row>
        )}
        {showUserGroups && (
          <Row>
            <ReduxFormElement
              className="user-form__groups"
              disabled={submitting || inEditMode}
              elementId="userGroups"
              field={selectedUserGroups}
              name={i18next.t(LOCALIZATION.FORM_USER_GROUPS_TITLE)}
            >
              <UserGroupsDropdown
                onSelectionChanged={this.handleUserGroupsChange}
                userGroups={userGroups}
              />
            </ReduxFormElement>
          </Row>
        )}
        <ButtonToolbar>
          <Button
            bsSize="large"
            bsStyle="primary"
            disabled={submitting || pristine}
            type="submit"
          >
            <LoaderContainer isLoading={submitting}>
              {inEditMode
                ? i18next.t(LOCALIZATION.BUTTON_SAVE_TITLE)
                : i18next.t(LOCALIZATION.BUTTON_ADD_TITLE)}
            </LoaderContainer>
          </Button>
          <Button bsSize="large" disabled={submitting} onClick={onCancel}>
            {i18next.t(LOCALIZATION.BUTTON_CANCEL_TITLE)}
          </Button>
        </ButtonToolbar>
        {error && (
          <div className="has-error">
            <HelpBlock>{error}</HelpBlock>
          </div>
        )}
      </form>
    );
  }
}

UserForm.propTypes = {
  handleSubmit: PropTypes.func,
  pristine: PropTypes.bool,
  submitting: PropTypes.bool,
  fields: PropTypes.object,
  onCancel: PropTypes.func,
  error: PropTypes.string,
  passwordOnly: PropTypes.bool,
  canChangeUsername: PropTypes.bool,
  userGroups: PropTypes.array,
};

export default reduxForm({
  getFormState,
  form: 'userForm',
  fields: ['id', 'nick', 'name', 'username', 'password', 'userGroups'],
  validate: validateUser,
})(UserForm);
