import React, { Component, PropTypes } from 'react';
import _ from 'lodash';
import { reduxForm } from 'redux-form';
import { LoaderContainer, ReduxFormElement } from '@shoutem/react-web-ui';
import { Row, Col, Button, ButtonToolbar, HelpBlock } from 'react-bootstrap';
import { getFormState } from 'src/redux';
import { validateMember } from '../../services';
import GeneratedPasswordControl from '../generated-password-control';
import './style.scss';

export class MemberForm extends Component {
  constructor(props) {
    super(props);

    this.handlePasswordGenerated = this.handlePasswordGenerated.bind(this);
  }

  handlePasswordGenerated(newPassword) {
    const { fields: { password } } = this.props;
    password.onChange(newPassword);
  }

  render() {
    const {
      submitting,
      pristine,
      fields: { id, firstName, lastName, email, password, nick },
      onCancel,
      handleSubmit,
      error,
      passwordOnly,
      canChangeUsername,
    } = this.props;

    const inEditMode = !_.isEmpty(id.value);
    const showPasswordField = passwordOnly || !inEditMode;

    return (
      <form className="member-form" onSubmit={handleSubmit}>
        {!passwordOnly &&
          <Row>
            <ReduxFormElement
              elementId="nick"
              name="Username"
              field={nick}
              disabled={submitting || !canChangeUsername}
            />
          </Row>
        }
        {!passwordOnly &&
          <Row>
            <Col xs={6} className="member-form__firstName">
              <ReduxFormElement
                elementId="firstName"
                name="First name"
                field={firstName}
                disabled={submitting}
              />
            </Col>
            <Col xs={6} className="member-form__lastName">
              <ReduxFormElement
                elementId="lastName"
                name="Last name"
                field={lastName}
                disabled={submitting}
              />
            </Col>
          </Row>
        }
        {!passwordOnly &&
          <Row>
            <ReduxFormElement
              elementId="email"
              name="E-mail address"
              field={email}
              disabled={submitting || inEditMode}
            />
          </Row>
        }
        {showPasswordField && (
          <Row>
            <GeneratedPasswordControl
              password={password}
              name="Password"
              field={password}
              disabled={submitting}
              onPasswordUpdated={this.handlePasswordGenerated}
            />
          </Row>
        )}
        <ButtonToolbar>
          <Button
            bsStyle="primary"
            bsSize="large"
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

MemberForm.propTypes = {
  handleSubmit: PropTypes.func,
  pristine: PropTypes.bool,
  submitting: PropTypes.bool,
  fields: PropTypes.object,
  onCancel: PropTypes.func,
  error: PropTypes.string,
  passwordOnly: PropTypes.bool,
  canChangeUsername: PropTypes.bool,
};

export default reduxForm({
  getFormState,
  form: 'memberForm',
  fields: [
    'id',
    'nick',
    'firstName',
    'lastName',
    'email',
    'password',
  ],
  validate: validateMember,
})(MemberForm);
