import React, { PropTypes } from 'react';
import { Row, Button, ButtonToolbar, HelpBlock } from 'react-bootstrap';
import Select from 'react-select';
import { reduxForm } from 'redux-form';
import { LoaderContainer, ReduxFormElement } from '@shoutem/react-web-ui';
import { getFormState } from 'src/redux';
import { validateSingleCardTransaction } from '../../services';
import './style.scss';

export function SingleCardTransactionForm({
  fields,
  submitting,
  handleSubmit,
  onCancel,
  users,
  error,
}) {
  const { userId, points } = fields;
  // error is always undefined
  console.log("error is:", error);
  const isDisabled = (!!error || submitting) ? true : false;
  console.log("isDisabled is:", isDisabled);
  return (
    <form className="transaction-form" onSubmit={handleSubmit}>
      <Row>
        <ReduxFormElement
          disabled={submitting}
          elementId="userId"
          field={userId}
          name="User"
        >
          <Select
            autoBlur
            clearable={false}
            options={users}
            placeholder="Select user"
          />
        </ReduxFormElement>
      </Row>
      <Row>
        <ReduxFormElement
          disabled={submitting}
          elementId="points"
          field={points}
          name="Add or deduct points"
        />
      </Row>
      <ButtonToolbar>
        <Button
          bsSize="large"
          bsStyle="primary"
          disabled={isDisabled}
          type="submit"
        >
          <LoaderContainer isLoading={submitting}>
            Add
          </LoaderContainer>
        </Button>
        <Button bsSize="large" disabled={submitting} onClick={onCancel}>
          Cancel
        </Button>
      </ButtonToolbar>
      {error &&
        <div className="has-error transaction-form__general-error">
          <HelpBlock>{error}</HelpBlock>
        </div>
      }
    </form>
  );
}

SingleCardTransactionForm.propTypes = {
  handleSubmit: PropTypes.func,
  onCancel: PropTypes.func,
  submitting: PropTypes.bool,
  fields: PropTypes.object,
  users: PropTypes.array,
  error: PropTypes.string,
};

export default reduxForm({
  getFormState,
  form: 'singleCardTransactionForm',
  fields: [
    'userId',
    'points',
  ],
  validate: validateSingleCardTransaction,
})(SingleCardTransactionForm);
