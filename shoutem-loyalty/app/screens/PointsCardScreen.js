import React from 'react';

import { connect } from 'react-redux';
import QRCode from 'react-native-qrcode';

import {
  find,
  getCollection,
  getOne,
  isBusy,
  shouldRefresh,
 } from '@shoutem/redux-io';

import { navigateTo, openInModal } from '@shoutem/core/navigation';

import {
  Button,
  Caption,
  Divider,
  ListView,
  Screen,
  Title,
  Text,
  View,
  TouchableOpacity,
} from '@shoutem/ui';

import { connectStyle } from '@shoutem/theme';
import { NavigationBar } from '@shoutem/ui/navigation';

import {
  loginRequired,
} from 'shoutem.auth';

import {
  ext,
  CARD_STATE_SCHEMA,
  TRANSACTIONS_SCHEMA,
} from '../const';

import { refreshCard } from '../redux';
import TransactionItem from '../components/TransactionItem';
import { transaction as transactionShape } from '../components/shapes';

const { arrayOf, func, number, shape, string } = React.PropTypes;

const VISIBLE_TRANSACTIONS = 2;

const renderTransactionRow = transaction => <TransactionItem transaction={transaction} />;

/**
 * Shows points card details
 */
export class PointsCardScreen extends React.Component {
  static propTypes = {
    // Card state, with points
    cardState: shape({
      points: number,
    }),
    // Parent card - it belongs to a user within a loyalty program
    card: shape({
      id: string,
    }),
    // Actions
    find: func,
    // Navigates to points history screen
    navigateTo: func,
    // Opens the assign points flow in a modal dialog
    openInModal: func,
    // Refreshes the loyalty card
    refreshCard: func,
    // Recent transactions
    transactions: arrayOf(transactionShape),
  };

  constructor(props) {
    super(props);

    this.assignPoints = this.assignPoints.bind(this);
    this.navigateToPointsHistoryScreen = this.navigateToPointsHistoryScreen.bind(this);
    this.refreshCardState = this.refreshCardState.bind(this);
  }

  componentWillMount() {
    this.refreshCardState();
  }

  componentWillReceiveProps(nextProps) {
    const { card: { id } } = this.props;
    const { card: { id: nextId }, cardState } = nextProps;

    const hasNewCardId = !id && nextId;

    if (hasNewCardId || (nextId && shouldRefresh(cardState))) {
      this.refreshCardState(nextId);
    }
  }

  assignPoints() {
    const { openInModal } = this.props;

    openInModal({
      screen: ext('VerificationScreen'),
    });
  }

  navigateToPointsHistoryScreen() {
    const { navigateTo } = this.props;

    navigateTo({
      screen: ext('PointsHistoryScreen'),
    });
  }

  refreshCardState(newCardId) {
    const { card, find, refreshCard } = this.props;

    const cardId = card.id || newCardId;

    if (!cardId) {
      refreshCard();
      return;
    }

    find(CARD_STATE_SCHEMA, undefined, {
      cardId,
    });

    find(TRANSACTIONS_SCHEMA, undefined, {
      'filter[card]': cardId,
    });
  }

  renderTransactionHistory() {
    const { transactions } = this.props;

    return (
      <View>
        <Divider styleName="section-header">
          <Caption>POINTS HISTORY</Caption>
        </Divider>
        <ListView
          data={transactions.slice(0, VISIBLE_TRANSACTIONS)}
          loading={isBusy(transactions)}
          renderRow={renderTransactionRow}
        />
        <Button
          styleName="md-gutter-vertical"
          onPress={this.navigateToPointsHistoryScreen}
        >
          <Text>SEE ENTIRE HISTORY</Text>
        </Button>
      </View>
    );
  }

  render() {
    const { cardState } = this.props;
    const { points = 0 } = cardState;

    return (
      <Screen>
        <NavigationBar title="MY CARD" />
        <View styleName="content sm-gutter solid vertical h-center">
          <TouchableOpacity onPress={this.assignPoints}>
            <QRCode
              size={160}
              value={'QRCodeValueForMyCard'}
            />
          </TouchableOpacity>
          <Caption styleName="h-center sm-gutter">Points</Caption>
          <Title styleName="h-center">{cardState ? points : ''}</Title>
          <Button
            styleName="secondary md-gutter-vertical"
            style={{ width: 160 }}
            onPress={() => this.refreshCardState()}
          >
            <Text>REFRESH</Text>
          </Button>
        </View>
        {this.renderTransactionHistory()}
      </Screen>
    );
  }
}

export const mapStateToProps = (state) => {
  const { allTransactions, card, cardState } = state[ext()];

  return {
    card: getOne(card, state),
    cardState: getOne(cardState, state),
    transactions: getCollection(allTransactions, state),
  };
};

export const mapDispatchToProps = { find, refreshCard, navigateTo, openInModal };

export default loginRequired(connect(mapStateToProps, mapDispatchToProps)(
  connectStyle(ext('PointsCardScreen'))(PointsCardScreen),
), true);
