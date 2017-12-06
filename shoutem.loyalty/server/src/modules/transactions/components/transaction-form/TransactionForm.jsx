import React, { PropTypes } from 'react';
import { Row, Button, ButtonToolbar, HelpBlock } from 'react-bootstrap';
import Select from 'react-select';
import { reduxForm } from 'redux-form';
import { LoaderContainer, ReduxFormElement } from '@shoutem/react-web-ui';
import { getFormState } from 'src/redux';
import { LOYALTY_TYPES } from 'src/const';
import { validateTransaction } from '../../services';
import './style.scss';

export function TransactionForm({
  fields,
  loyaltyType,
  submitting,
  handleSubmit,
  onCancel,
  rewards,
  places,
  users,
  error,
}) {
  const { userId, placeId, rewardId, points } = fields;
  const pointsLabel = loyaltyType === LOYALTY_TYPES.PUNCH ?
    'Add or deduct stamps' :
    'Add or deduct points';

  return (
    <form className="transaction-form" onSubmit={handleSubmit}>
      {loyaltyType === LOYALTY_TYPES.PUNCH &&
        <Row>
          <ReduxFormElement
            disabled={submitting}
            elementId="rewardId"
            field={rewardId}
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
      }
      {loyaltyType === LOYALTY_TYPES.MULTI &&
        <Row>
          <ReduxFormElement
            disabled={submitting}
            elementId="placeId"
            field={placeId}
            name="Place"
          >
            <Select
              autoBlur
              clearable={false}
              options={places}
              placeholder="Select place"
            />
          </ReduxFormElement>
        </Row>
      }
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
          name={pointsLabel}
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

TransactionForm.propTypes = {
  handleSubmit: PropTypes.func,
  onCancel: PropTypes.func,
  submitting: PropTypes.bool,
  fields: PropTypes.object,
  loyaltyType: PropTypes.string,
  users: PropTypes.array,
  rewards: PropTypes.array,
  places: PropTypes.array,
  error: PropTypes.string,
};

export default reduxForm({
  getFormState,
  form: 'transactionForm',
  fields: [
    'userId',
    'placeId',
    'rewardId',
    'points',
  ],
  validate: validateTransaction,
})(TransactionForm);
