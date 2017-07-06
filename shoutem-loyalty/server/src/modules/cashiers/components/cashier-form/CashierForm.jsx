import React, { PropTypes } from 'react';
import { reduxForm } from 'redux-form';
import {
  PasswordBox,
  LoaderContainer,
  ReduxFormElement,
} from '@shoutem/react-web-ui';
import { Row, Button, ButtonToolbar, HelpBlock } from 'react-bootstrap';
import { getFormState } from '../../../../redux';
import { validateCashier } from '../../services';
import './style.scss';

export function CashierForm({
  handleSubmit,
  submitting,
  fields,
  onCancel,
  error,
}) {
  const { firstName, lastName, email, password, pin } = fields;

  return (
    <form className="cashier-form" onSubmit={handleSubmit}>
      <Row>
        <ReduxFormElement
          elementId="firstName"
          name="First name"
          field={firstName}
          disabled={submitting}
        />
      </Row>
      <Row>
        <ReduxFormElement
          elementId="lastName"
          name="Last name"
          field={lastName}
          disabled={submitting}
        />
      </Row>
      <Row>
        <ReduxFormElement
          elementId="email"
          name="E-mail address"
          field={email}
          disabled={submitting}
        />
      </Row>
      <Row>
        <ReduxFormElement
          elementId="password"
          name="App login password"
          field={password}
          disabled={submitting}
        >
          <PasswordBox />
        </ReduxFormElement>
      </Row>
      <Row>
        <ReduxFormElement
          elementId="pin"
          name="PIN"
          field={pin}
          disabled={submitting}
        >
          <PasswordBox />
        </ReduxFormElement>
      </Row>
      <ButtonToolbar>
        <Button bsStyle="primary" bsSize="large" disabled={submitting} type="submit">
          <LoaderContainer isLoading={submitting}>
            Add
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

CashierForm.propTypes = {
  handleSubmit: PropTypes.func,
  submitting: PropTypes.bool,
  fields: PropTypes.object,
  onCancel: PropTypes.func,
  error: PropTypes.string,
};

export default reduxForm({
  getFormState,
  form: 'cashierForm',
  fields: [
    'firstName',
    'lastName',
    'email',
    'password',
    'pin',
  ],
  validate: validateCashier,
})(CashierForm);
