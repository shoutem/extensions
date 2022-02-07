import React from 'react';
import { Button } from 'react-bootstrap';
import i18next from 'i18next';
import moment from 'moment';
import PropTypes from 'prop-types';
import { FontIcon } from '@shoutem/react-web-ui';
import LOCALIZATION from './localization';
import './style.scss';

function formatUserLabel(user) {
  const firstName = user?.profile.firstName;
  const lastName = user?.profile.lastName;

  return `${firstName} ${lastName}`;
}

function formatDateTime(dateTime) {
  return moment(dateTime).format(
    i18next.t(LOCALIZATION.TRANSACTION_TABLE_ROW_DATE_FORMAT),
  );
}

function formatPoints(points) {
  return points > 0 ? `+${points}` : points;
}

export default function TransactionTableRow(props) {
  const { onDeleteClick, transactionInfo } = props;
  const {
    user,
    transaction: {
      createdAt,
      id,
      transactionData: { points },
    },
  } = transactionInfo;

  function handleDeleteTransactionClick() {
    onDeleteClick(id);
  }

  return (
    <tr className="transaction-table-row">
      <td className="transaction-table-row__user">{formatUserLabel(user)}</td>
      <td className="transaction-table-row__time">
        {createdAt && formatDateTime(createdAt)}
      </td>
      <td className="transaction-table-row__points">{formatPoints(points)}</td>
      <td className="transaction-table-row__action">
        <Button
          className="btn-icon pull-right"
          onClick={handleDeleteTransactionClick}
        >
          <FontIcon name="delete" size="24px" />
        </Button>
      </td>
    </tr>
  );
}

TransactionTableRow.propTypes = {
  transactionInfo: PropTypes.object.isRequired,
  onDeleteClick: PropTypes.func.isRequired,
};
