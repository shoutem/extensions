import React, { Component, PropTypes } from 'react';
import _ from 'lodash';
import { reduxForm } from 'redux-form';
import { Row, Col, Button, ButtonToolbar, HelpBlock } from 'react-bootstrap';
import { LoaderContainer, ReduxFormElement } from '@shoutem/react-web-ui';
import { getFormState } from 'src/redux';
import { UserGroupsDropdown } from 'src/modules/user-groups';
import { validateUser } from '../../services';
import GeneratedPasswordControl from '../generated-password-control';
import './style.scss';

export class UserForm extends Component {
  constructor(props) {
    super(props);

    this.handlePasswordGenerated = this.handlePasswordGenerated.bind(this);
    this.handleUserGroupsChange = this.handleUserGroupsChange.bind(this);
  }

  handlePasswordGenerated(newPassword) {
    const { fields: { password } } = this.props;
    password.onChange(newPassword);
  }

  handleUserGroupsChange(newUserGroups) {
    const { fields: { userGroups } } = this.props;
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
        {!passwordOnly &&
          <Row>
            <ReduxFormElement
              disabled={submitting || !canChangeUsername}
              elementId="nick"
              field={nick}
              name="Username"
            />
          </Row>
        }
        {!passwordOnly &&
          <Row>
            <ReduxFormElement
              disabled={submitting}
              elementId="name"
              field={name}
              name="Name and surname"
            />
          </Row>
        }
        {!passwordOnly &&
          <Row>
            <ReduxFormElement
              disabled={submitting || inEditMode}
              elementId="username"
              field={username}
              name="E-mail address"
            />
          </Row>
        }
        {showPasswordField && (
          <Row>
            <GeneratedPasswordControl
              disabled={submitting}
              field={password}
              name="Password"
              onPasswordUpdated={this.handlePasswordGenerated}
              password={password}
            />
          </Row>
        )}
        {showUserGroups &&
          <Row>
            <ReduxFormElement
              className="user-form__groups"
              disabled={submitting || inEditMode}
              elementId="userGroups"
              field={selectedUserGroups}
              name="User groups"
            >
              <UserGroupsDropdown
                onSelectionChanged={this.handleUserGroupsChange}
                userGroups={userGroups}
              />
            </ReduxFormElement>
          </Row>
        }
        <ButtonToolbar>
          <Button
            bsSize="large"
            bsStyle="primary"
            disabled={submitting || pristine}
            type="submit"
          >
            <LoaderContainer isLoading={submitting}>
              {inEditMode ? 'Save' : 'Add'}
            </LoaderContainer>
          </Button>
          <Button bsSize="large" disabled={submitting} onClick={onCancel}>
            Cancel
          </Button>
        </ButtonToolbar>
        {error &&
          <div className="has-error">
            <HelpBlock>{error}</HelpBlock>
          </div>
        }
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
  fields: [
    'id',
    'nick',
    'name',
    'username',
    'password',
    'userGroups',
  ],
  validate: validateUser,
})(UserForm);
