import React, { Component } from 'react';
import autoBindReact from 'auto-bind/react';
import i18next from 'i18next';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { LOYALTY_TYPES } from 'src/const';
import { FontIcon } from '@shoutem/react-web-ui';
import TransactionTableRow from '../transaction-table-row';
import LOCALIZATION from './localization';
import './style.scss';

function renderEmptyTableRow(loyaltyType) {
  // there are 5 basic columns
  // for MULTI - we display additional column `place`
  // for PUNCH - we display additional column `card`
  const colSpan = loyaltyType === LOYALTY_TYPES.POINTS ? 5 : 6;

  return (
    <tr className="transactions-table__empty-row">
      <td colSpan={colSpan}>
        {i18next.t(LOCALIZATION.EMPTY_PLACEHOLDER_TITLE)}
      </td>
    </tr>
  );
}

export default class TransactionsTable extends Component {
  constructor(props) {
    super(props);
    autoBindReact(this);

    this.state = {
      filter: {},
    };
  }

  componentWillReceiveProps(nextProps) {
    const { loyaltyType: nextLoyaltyType } = nextProps;
    const { loyaltyType } = this.props;

    if (nextLoyaltyType !== loyaltyType) {
      const { filter } = this.state;

      // remember filtered props that are common for all loyalty types
      const newFilter = _.pick(filter, ['userId', 'cashierId']);
      this.setState({ filter: newFilter });
    }
  }

  renderData() {
    const { loyaltyType, transactionInfos, onDeleteClick } = this.props;

    return _.map(transactionInfos, transactionInfo => (
      <TransactionTableRow
        key={transactionInfo.id}
        loyaltyType={loyaltyType}
        onDeleteClick={onDeleteClick}
        transactionInfo={transactionInfo}
      />
    ));
  }

  renderHeader() {
    const { loyaltyType } = this.props;

    return (
      <tr>
        <th className="transactions-table__user">
          {i18next.t(LOCALIZATION.HEADER_USER_TITLE)}
        </th>
        {loyaltyType === LOYALTY_TYPES.PUNCH && (
          <th className="transactions-table__card">
            {i18next.t(LOCALIZATION.HEADER_CARD_TITLE)}
          </th>
        )}
        {loyaltyType === LOYALTY_TYPES.MULTI && (
          <th className="transactions-table__place">
            {i18next.t(LOCALIZATION.HEADER_PLACE_TITLE)}
          </th>
        )}
        <th className="transactions-table__cashier">
          {i18next.t(LOCALIZATION.HEADER_CASHIER_TITLE)}
        </th>
        <th className="transactions-table__time">
          {i18next.t(LOCALIZATION.HEADER_TIME_TITLE)}
          <FontIcon name="sortdescending" />
        </th>
        <th className="transactions-table__transaction">
          {i18next.t(LOCALIZATION.HEADER_TRANSACTION_TITLE)}
        </th>
        <th className="transactions-table__actions" />
      </tr>
    );
  }

  render() {
    const { loyaltyType, transactionInfos } = this.props;
    const dataEmpty = _.isEmpty(transactionInfos);

    return (
      <table className="transactions-table table">
        <thead>{this.renderHeader()}</thead>
        <tbody>
          {dataEmpty && renderEmptyTableRow(loyaltyType)}
          {!dataEmpty && this.renderData()}
        </tbody>
      </table>
    );
  }
}

TransactionsTable.propTypes = {
  loyaltyType: PropTypes.string,
  transactionInfos: PropTypes.array,
  onDeleteClick: PropTypes.func,
};
