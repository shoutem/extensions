import React from 'react';
import { Button, ButtonToolbar, HelpBlock, Row } from 'react-bootstrap';
import i18next from 'i18next';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { reduxForm } from 'redux-form';
import { CmsSelect } from 'src/modules/cms';
import { getFormState } from 'src/redux';
import {
  LoaderContainer,
  PasswordBox,
  ReduxFormElement,
} from '@shoutem/react-web-ui';
import { validateCashier } from '../../services';
import LOCALIZATION from './localization';
import './style.scss';

export function CashierForm({
  submitting,
  fields,
  onCancel,
  handleSubmit,
  error,
  places,
  placesDescriptor,
  currentPlaceId,
  onPlaceChange,
}) {
  const { id, firstName, lastName, email, password, pin } = fields;

  const inEditMode = !_.isEmpty(id.value);
  if (inEditMode) {
    // if cashier exists, he already has password. We cannot get it from API (security issue),
    // but we still want to indicate that password exists and that it cannot be changed here.
    password.value = '*******';
  }

  return (
    <form className="cashier-form" onSubmit={handleSubmit}>
      <Row>
        <ReduxFormElement
          disabled={submitting}
          elementId="firstName"
          field={firstName}
          name={i18next.t(LOCALIZATION.FORM_FIRST_NAME_TITLE)}
        />
      </Row>
      <Row>
        <ReduxFormElement
          disabled={submitting}
          elementId="lastName"
          field={lastName}
          name={i18next.t(LOCALIZATION.FORM_FIRST_NAME_TITLE)}
        />
      </Row>
      <Row>
        <ReduxFormElement
          disabled={inEditMode || submitting}
          elementId="email"
          field={email}
          name={i18next.t(LOCALIZATION.FORM_EMAIL_ADDRESS_TITLE)}
        />
      </Row>
      <Row>
        <ReduxFormElement
          disabled={inEditMode || submitting}
          elementId="password"
          field={password}
          helpText={i18next.t(LOCALIZATION.PASSWORD_HELP_TEXT)}
          name={i18next.t(LOCALIZATION.FORM_PASSWORD_TITLE)}
        >
          <PasswordBox />
        </ReduxFormElement>
      </Row>
      <Row>
        <ReduxFormElement
          disabled={submitting}
          elementId="pin"
          field={pin}
          helpText={i18next.t(LOCALIZATION.PIN_HELP_TEXT)}
          name={i18next.t(LOCALIZATION.FORM_PIN_TITLE)}
        />
      </Row>
      {!_.isEmpty(places) && (
        <Row>
          <CmsSelect
            allItemsLabel={i18next.t(LOCALIZATION.FORM_ALL_STORES_TITLE)}
            defaultValue={currentPlaceId}
            descriptor={placesDescriptor}
            dropdownLabel={i18next.t(LOCALIZATION.FORM_SELECT_STORE_TITLE)}
            onFilterChange={onPlaceChange}
            resources={places}
          />
        </Row>
      )}
      <ButtonToolbar>
        <Button
          bsSize="large"
          bsStyle="primary"
          disabled={submitting}
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

CashierForm.propTypes = {
  handleSubmit: PropTypes.func,
  submitting: PropTypes.bool,
  fields: PropTypes.object,
  onCancel: PropTypes.func,
  error: PropTypes.string,
  currentPlaceId: PropTypes.string,
  places: PropTypes.array,
  placesDescriptor: PropTypes.object,
  onPlaceChange: PropTypes.func,
};

export default reduxForm({
  getFormState,
  form: 'cashierForm',
  fields: ['id', 'firstName', 'lastName', 'email', 'password', 'pin'],
  validate: validateCashier,
})(CashierForm);
