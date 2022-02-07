import React, { useMemo, useState } from 'react';
import {
  Button,
  ButtonToolbar,
  ControlLabel,
  FormControl,
  FormGroup,
  HelpBlock,
  Row,
} from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Select from 'react-select';
import i18next from 'i18next';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { LoaderContainer } from '@shoutem/react-web-ui';
import { createTransactionAndCard, getAllCards, getUsers } from '../../redux';
import { formatUsers } from '../../services';
import LOCALIZATION from './localization';
import './style.scss';

function AddTransactionForm(props) {
  const { programId, onModalDismiss } = props;

  const dispatch = useDispatch();

  const cards = useSelector(getAllCards);
  const usersData = useSelector(getUsers);
  const users = formatUsers(usersData);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const [points, setPoints] = useState('');
  const [selectedUserId, setSelectedUserId] = useState();

  const isSaveEnabled = useMemo(() => !_.isEmpty(points) && selectedUserId, [
    points,
    selectedUserId,
  ]);

  function handleUserSelected({ value }) {
    setSelectedUserId(value);
  }

  function handlePointsChange(event) {
    setPoints(event.target.value);
  }

  function handleSavePress() {
    setIsLoading(true);

    const cardId = _.get(cards, [selectedUserId, 'id']);

    dispatch(
      createTransactionAndCard(programId, selectedUserId, cardId, { points }),
    )
      .then(() => {
        setIsLoading(false);
        onModalDismiss();
      })
      .catch(() => {
        setIsLoading(false);
        setError(
          i18next.t(LOCALIZATION.ADD_TRANSACTION_FORM_UNABLE_TO_CREATE_MESSAGE),
        );
      });
  }

  return (
    <div className="transaction-form">
      <FormGroup>
        <Row>
          <ControlLabel>
            {i18next.t(LOCALIZATION.ADD_TRANSACTION_FORM_USER_TITLE)}
          </ControlLabel>
          <Select
            autoBlur
            clearable={false}
            value={selectedUserId}
            options={users}
            onChange={handleUserSelected}
            placeholder={i18next.t(
              LOCALIZATION.ADD_TRANSACTION_FORM_SELECT_USER_TITLE,
            )}
          />
        </Row>
        <Row>
          <ControlLabel>
            {i18next.t(LOCALIZATION.ADD_TRANSACTION_FORM_POINTS_TITLE)}
          </ControlLabel>
          <FormControl
            className="form-control"
            onChange={handlePointsChange}
            type="number"
            value={points}
          />
        </Row>
      </FormGroup>
      <ButtonToolbar>
        <Button
          bsSize="large"
          bsStyle="primary"
          disabled={!isSaveEnabled}
          onClick={handleSavePress}
        >
          <LoaderContainer isLoading={isLoading}>
            {i18next.t(LOCALIZATION.ADD_TRANSACTION_FORM_BUTTON_SUBMIT_TITLE)}
          </LoaderContainer>
        </Button>
        <Button bsSize="large" disabled={isLoading} onClick={onModalDismiss}>
          {i18next.t(LOCALIZATION.ADD_TRANSACTION_FORM_BUTTON_CANCEL_TITLE)}
        </Button>
      </ButtonToolbar>
      {error && (
        <div className="has-error transaction-form__general-error">
          <HelpBlock>{error}</HelpBlock>
        </div>
      )}
    </div>
  );
}

AddTransactionForm.propTypes = {
  programId: PropTypes.string.isRequired,
  onModalDismiss: PropTypes.func.isRequired,
};

export default AddTransactionForm;
