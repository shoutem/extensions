import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getCollection } from '@shoutem/redux-io';
import { connectStyle } from '@shoutem/theme';
import { Screen } from '@shoutem/ui';
import { I18n } from 'shoutem.i18n';
import { transactionShape } from '../components/shapes';
import TransactionHistoryView from '../components/TransactionHistoryView';
import { ext } from '../const';

const { arrayOf } = PropTypes;

/* eslint-disable class-methods-use-this */

/**
 * Displays the transaction history for a points card.
 * A transaction can be adding points to a card or redeeming a reward.
 */
export class PointsHistoryScreen extends PureComponent {
  static propTypes = {
    // Transactions
    transactions: arrayOf(transactionShape),
  };

  componentDidMount() {
    const { navigation } = this.props;

    navigation.setOptions({ ...this.getNavBarProps() });
  }

  getNavBarProps() {
    return {
      title: I18n.t(ext('pointsHistoryNavBarTitle')),
    };
  }

  render() {
    const { transactions } = this.props;

    return (
      <Screen>
        <TransactionHistoryView transactions={transactions} />
      </Screen>
    );
  }
}

export const mapStateToProps = state => {
  const { allTransactions } = state[ext()];

  return {
    transactions: getCollection(allTransactions, state),
  };
};

export default connect(
  mapStateToProps,
  null,
)(connectStyle(ext('PointsHistoryScreen'))(PointsHistoryScreen));
