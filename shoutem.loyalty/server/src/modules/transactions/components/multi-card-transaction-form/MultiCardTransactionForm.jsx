import React, { PropTypes } from 'react';
import { Row, Button, ButtonToolbar, HelpBlock } from 'react-bootstrap';
import Select from 'react-select';
import { reduxForm } from 'redux-form';
import { LoaderContainer, ReduxFormElement } from '@shoutem/react-web-ui';
import { getFormState } from 'src/redux';
import { validateMultiCardTransaction } from '../../services';
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
          name="Add or deduct points"
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
  fields: [
    'user',
    'place',
    'points',
  ],
  validate: validateMultiCardTransaction,
})(MultiCardTransactionForm);
