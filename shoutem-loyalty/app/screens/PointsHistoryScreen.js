import React from 'react';

import { connect } from 'react-redux';

import moment from 'moment';

import {
  find,
  getCollection,
  getOne,
  next,
 } from '@shoutem/redux-io';

import {
  ListScreen,
} from 'shoutem.application';

import {
  Caption,
  Divider,
} from '@shoutem/ui';

import { connectStyle } from '@shoutem/theme';

import {
  ext,
  TRANSACTIONS_SCHEMA,
} from '../const';

import { transaction as transactionShape } from '../components/shapes';
import TransactionItem from '../components/TransactionItem';

const { arrayOf, func, shape, string } = React.PropTypes;

/* eslint-disable class-methods-use-this */

/**
 * Displays the transaction history for a points card.
 * A transaction can be adding points to a card or redeeming a reward.
 */
export class PointsHistoryScreen extends ListScreen {
  static propTypes = {
    ...ListScreen.propTypes,
     // Loyalty card for user
    card: shape({
      // Card ID
      id: string,
    }),
    // Transactions
    data: arrayOf(transactionShape),
    // Actions
    find: func,
    next: func,
  };

  constructor(props) {
    super(props);

    this.state = {
      schema: TRANSACTIONS_SCHEMA,
    };
  }

  fetchData() {
    const { card, find } = this.props;
    const { schema } = this.state;

    find(schema, undefined, {
      'filter[card]': card.id,
    });
  }

  getSectionId({ createdAt }) {
    return moment(createdAt).format('YYYY');
  }

  renderSectionHeader(sectionId) {
    const currentYear = moment().format('YYYY');

    return (
      sectionId === currentYear ?
        null
        :
        <Divider styleName="section-header">
          <Caption>{sectionId}</Caption>
        </Divider>
    );
  }

  renderRow(transaction) {
    return <TransactionItem transaction={transaction} />;
  }

  getNavigationBarProps() {
    return {
      title: 'POINTS HISTORY',
    };
  }
}

export const mapStateToProps = (state) => {
  const { allTransactions, card } = state[ext()];

  return {
    card: getOne(card, state),
    data: getCollection(allTransactions, state),
  };
};

export const mapDispatchToProps = { find, next };

export default connect(mapStateToProps, mapDispatchToProps)(
  connectStyle(ext('PointsHistoryScreen'))(PointsHistoryScreen),
);

