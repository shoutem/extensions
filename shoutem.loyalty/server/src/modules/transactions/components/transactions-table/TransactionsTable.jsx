import React, { Component, PropTypes } from 'react';
import _ from 'lodash';
import { FontIcon } from '@shoutem/react-web-ui';
import { LOYALTY_TYPES } from 'src/const';
import TransactionTableRow from '../transaction-table-row';
import './style.scss';

function renderEmptyTableRow(loyaltyType) {
  // there are 5 basic columns
  // for MULTI - we display additional column `place`
  // for PUNCH - we display additional column `card`
  const colSpan = loyaltyType === LOYALTY_TYPES.POINTS ? 5 : 6;

  return (
    <tr className="transactions-table__empty-row">
      <td colSpan={colSpan}>
        No transactions for chosen filter.
      </td>
    </tr>
  );
}

export default class TransactionsTable extends Component {
  constructor(props) {
    super(props);

    this.renderData = this.renderData.bind(this);
    this.renderHeader = this.renderHeader.bind(this);

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
    const {
      loyaltyType,
      transactionInfos,
      onDeleteClick,
    } = this.props;

    return (
      _.map(transactionInfos, transactionInfo => (
        <TransactionTableRow
          key={transactionInfo.id}
          loyaltyType={loyaltyType}
          onDeleteClick={onDeleteClick}
          transactionInfo={transactionInfo}
        />
      ))
    );
  }

  renderHeader() {
    const { loyaltyType } = this.props;

    return (
      <tr>
        <th className="transactions-table__user">
          User
        </th>
        {loyaltyType === LOYALTY_TYPES.PUNCH &&
          <th className="transactions-table__card">
            Card
          </th>
        }
        {loyaltyType === LOYALTY_TYPES.MULTI &&
          <th className="transactions-table__place">
            Place
          </th>
        }
        <th className="transactions-table__cashier">
          Cashier
        </th>
        <th className="transactions-table__time">
          Time
          <FontIcon name="sortdescending" />
        </th>
        <th className="transactions-table__transaction">
          Transaction
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
        <thead>
          {this.renderHeader()}
        </thead>
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
