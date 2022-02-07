import React from 'react';
import { Button } from 'react-bootstrap';
import i18next from 'i18next';
import PropTypes from 'prop-types';
import { IconLabel } from '@shoutem/react-web-ui';
import LOCALIZATION from './localization';
import './style.scss';

function AddTransactionButton(props) {
  const { onClick } = props;

  return (
    <div className="container">
      <Button className="btn-icon pull-right" onClick={onClick}>
        <IconLabel iconName="add">
          {i18next.t(LOCALIZATION.ADD_TRANSACTION_BUTTON_TITLE)}
        </IconLabel>
      </Button>
    </div>
  );
}

AddTransactionButton.propTypes = {
  onClick: PropTypes.func.isRequired,
};

export default AddTransactionButton;
