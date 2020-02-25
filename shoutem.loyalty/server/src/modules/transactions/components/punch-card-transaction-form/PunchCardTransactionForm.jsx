import React, { PropTypes } from 'react';
import { Row, Button, ButtonToolbar, HelpBlock } from 'react-bootstrap';
import Select from 'react-select';
import { reduxForm } from 'redux-form';
import { LoaderContainer, ReduxFormElement } from '@shoutem/react-web-ui';
import { getFormState } from 'src/redux';
import { validatePunchCardTransaction } from '../../services';
import './style.scss';

export function PunchCardTransactionForm({
  fields,
  submitting,
  handleSubmit,
  onCancel,
  rewards,
  users,
  error,
}) {
  const { user, reward, points } = fields;

  return (
    <form className="transaction-form" onSubmit={handleSubmit}>
      <Row>
        <ReduxFormElement
          disabled={submitting}
          elementId="reward"
          field={reward}
          name="Punch card"
        >
          <Select
            autoBlur
            clearable={false}
            options={rewards}
            placeholder="Select card"
          />
        </ReduxFormElement>
      </Row>
      <Row>
        <ReduxFormElement
          disabled={submitting}
          elementId="user"
          field={user}
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
          name="Add or deduct stamps"
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

PunchCardTransactionForm.propTypes = {
  handleSubmit: PropTypes.func,
  onCancel: PropTypes.func,
  submitting: PropTypes.bool,
  fields: PropTypes.object,
  users: PropTypes.array,
  rewards: PropTypes.array,
  error: PropTypes.string,
};

export default reduxForm({
  getFormState,
  form: 'punchCardTransactionForm',
  fields: [
    'user',
    'reward',
    'points',
  ],
  validate: validatePunchCardTransaction,
})(PunchCardTransactionForm);
