import React from 'react';
import { Button, ButtonToolbar, HelpBlock, Row } from 'react-bootstrap';
import Select from 'react-select';
import i18next from 'i18next';
import PropTypes from 'prop-types';
import { reduxForm } from 'redux-form';
import { getFormState } from 'src/redux';
import { LoaderContainer, ReduxFormElement } from '@shoutem/react-web-ui';
import { validateMultiCardTransaction } from '../../services';
import LOCALIZATION from './localization';
import './style.scss';

export function MultiCardTransactionForm({
  fields,
  submitting,
  handleSubmit,
  onCancel,
  places,
  users,
  error,
}) {
  const { user, place, points } = fields;

  return (
    <form className="transaction-form" onSubmit={handleSubmit}>
      <Row>
        <ReduxFormElement
          disabled={submitting}
          elementId="place"
          field={place}
          name={i18next.t(LOCALIZATION.FORM_PLACE_TITLE)}
        >
          <Select
            autoBlur
            clearable={false}
            options={places}
            placeholder={i18next.t(LOCALIZATION.FORM_SELECT_PLACE_TITLE)}
          />
        </ReduxFormElement>
      </Row>
      <Row>
        <ReduxFormElement
          disabled={submitting}
          elementId="user"
          field={user}
          name={i18next.t(LOCALIZATION.FORM_USER_TITLE)}
        >
          <Select
            autoBlur
            clearable={false}
            options={users}
            placeholder={i18next.t(LOCALIZATION.FORM_SELECT_USER_TITLE)}
          />
        </ReduxFormElement>
      </Row>
      <Row>
        <ReduxFormElement
          disabled={submitting}
          elementId="points"
          field={points}
          name={i18next.t(LOCALIZATION.FORM_POINTS_TITLE)}
        />
      </Row>
      <ButtonToolbar>
        <Button
          bsSize="large"
          bsStyle="primary"
          disabled={submitting}
          type="submit"
        >
          <LoaderContainer isLoading={submitting}>
            {i18next.t(LOCALIZATION.BUTTON_SUBMIT_TITLE)}
          </LoaderContainer>
        </Button>
        <Button bsSize="large" disabled={submitting} onClick={onCancel}>
          {i18next.t(LOCALIZATION.BUTTON_CANCEL_TITLE)}
        </Button>
      </ButtonToolbar>
      {error && (
        <div className="has-error transaction-form__general-error">
          <HelpBlock>{error}</HelpBlock>
        </div>
      )}
    </form>
  );
}

MultiCardTransactionForm.propTypes = {
  handleSubmit: PropTypes.func,
  onCancel: PropTypes.func,
  submitting: PropTypes.bool,
  fields: PropTypes.object,
  users: PropTypes.array,
  places: PropTypes.array,
  error: PropTypes.string,
};

export default reduxForm({
  getFormState,
  form: 'multiCardTransactionForm',
  fields: ['user', 'place', 'points'],
  validate: validateMultiCardTransaction,
})(MultiCardTransactionForm);
