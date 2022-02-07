import React, { Component } from 'react';
import { Button } from 'react-bootstrap';
import i18next from 'i18next';
import moment from 'moment';
import PropTypes from 'prop-types';
import { LOYALTY_TYPES } from 'src/const';
import { FontIcon } from '@shoutem/react-web-ui';
import {
  formatCashierLabel,
  formatPlaceLabel,
  formatRewardLabel,
  formatUserLabel,
} from '../../services';
import LOCALIZATION from './localization';
import './style.scss';

function formatDateTime(dateTime) {
  return moment(dateTime).format(i18next.t(LOCALIZATION.DATE_FORMAT));
}

function formatPoints(points) {
  return points > 0 ? `+${points}` : points;
}

export default class TransactionTableRow extends Component {
  constructor(props) {
    super(props);

    this.handleDeleteTransactionClick = this.handleDeleteTransactionClick.bind(
      this,
    );
  }

  handleDeleteTransactionClick() {
    const {
      onDeleteClick,
      transactionInfo: {
        transaction: { id: transactionId },
      },
    } = this.props;

    onDeleteClick(transactionId);
  }

  render() {
    const { loyaltyType, transactionInfo } = this.props;

    const {
      cashier,
      place,
      user,
      reward,
      transaction: {
        createdAt,
        transactionData: { points },
      },
    } = transactionInfo;

    return (
      <tr className="transaction-table-row">
        <td className="transaction-table-row__user">{formatUserLabel(user)}</td>
        {loyaltyType === LOYALTY_TYPES.PUNCH && (
          <td className="transaction-table-row__reward">
            {formatRewardLabel(reward)}
          </td>
        )}
        {loyaltyType === LOYALTY_TYPES.MULTI && (
          <td className="transaction-table-row__place">
            {formatPlaceLabel(place)}
          </td>
        )}
        <td className="transaction-table-row__cashier">
          {formatCashierLabel(cashier)}
        </td>
        <td className="transaction-table-row__time">
          {createdAt && formatDateTime(createdAt)}
        </td>
        <td className="transaction-table-row__points">
          {formatPoints(points)}
        </td>
        <td className="transaction-table-row__action">
          <Button
            className="btn-icon pull-right"
            onClick={this.handleDeleteTransactionClick}
          >
            <FontIcon name="delete" size="24px" />
          </Button>
        </td>
      </tr>
    );
  }
}

TransactionTableRow.propTypes = {
  loyaltyType: PropTypes.string,
  transactionInfo: PropTypes.object,
  onDeleteClick: PropTypes.func,
};
