import React from 'react';
import i18next from 'i18next';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { FontIcon } from '@shoutem/react-web-ui';
import TransactionTableRow from '../transaction-table-row';
import LOCALIZATION from './localization';
import './style.scss';

export function TransactionsTable(props) {
  const { transactionInfos, onDeleteClick } = props;
  const dataEmpty = _.isEmpty(transactionInfos);

  return (
    <table className="transactions-table table">
      <thead>
        <tr>
          <th className="transactions-table__user">
            {i18next.t(LOCALIZATION.TRANSACTIONS_TABLE_HEADER_USER_TITLE)}
          </th>
          <th className="transactions-table__time">
            {i18next.t(LOCALIZATION.TRANSACTIONS_TABLE_HEADER_TIME_TITLE)}
            <FontIcon name="sortdescending" />
          </th>
          <th className="transactions-table__transaction">
            {i18next.t(
              LOCALIZATION.TRANSACTIONS_TABLE_HEADER_TRANSACTION_TITLE,
            )}
          </th>
          {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
          <th className="transactions-table__actions" />
        </tr>
      </thead>
      <tbody>
        {dataEmpty && (
          <tr className="transactions-table__empty-row">
            <td colSpan={5}>
              {i18next.t(
                LOCALIZATION.TRANSACTIONS_TABLE_EMPTY_PLACEHOLDER_TITLE,
              )}
            </td>
          </tr>
        )}
        {!dataEmpty &&
          _.map(transactionInfos, transactionInfo => (
            <TransactionTableRow
              key={transactionInfo.id}
              onDeleteClick={onDeleteClick}
              transactionInfo={transactionInfo}
            />
          ))}
      </tbody>
    </table>
  );
}

TransactionsTable.propTypes = {
  transactionInfos: PropTypes.array.isRequired,
  onDeleteClick: PropTypes.func.isRequired,
};

export default TransactionsTable;
