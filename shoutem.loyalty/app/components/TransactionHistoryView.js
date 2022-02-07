import React, { PureComponent } from 'react';
import autoBindReact from 'auto-bind/react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { isBusy, isError, isInitialized } from '@shoutem/redux-io';
import { connectStyle } from '@shoutem/theme';
import {
  Button,
  Caption,
  Divider,
  Image,
  ListView,
  Row,
  Text,
  View,
} from '@shoutem/ui';
import { I18n } from 'shoutem.i18n';
import { ext } from '../const';
import { transactionShape } from './shapes';
import TransactionItem from './TransactionItem';

const NO_ACTIVITY_ICON = require('../assets/icons/no-activity.png');

const renderTransactionRow = transaction => (
  <TransactionItem transaction={transaction} />
);

/**
 * Shows points card details for a single card loyalty program
 */
export class TransactionHistoryView extends PureComponent {
  static propTypes = {
    // Called when the user presses the Show history button
    onShowHistory: PropTypes.func,
    // Recent transactions
    transactions: PropTypes.arrayOf(transactionShape),
  };

  constructor(props) {
    super(props);

    autoBindReact(this);

    this.state = {
      numberOfVisibleTransactions: 3,
    };
  }

  shouldRenderPlaceholderView() {
    const { transactions } = this.props;

    if (!isInitialized(transactions) || isBusy(transactions)) {
      // Data is loading, treat it as valid for now
      return false;
    }

    // We want to render a placeholder in case of errors or if transactions are empty
    return isError(transactions) || !_.size(transactions) || !transactions;
  }

  // eslint-disable-next-line class-methods-use-this
  renderPlaceholderView() {
    return (
      <Row styleName="small">
        <Image source={NO_ACTIVITY_ICON} styleName="small-avatar" />
        <Text styleName="h-start">{I18n.t(ext('noHistory'))}</Text>
      </Row>
    );
  }

  showEntireHistory() {
    const { onShowHistory } = this.props;

    if (onShowHistory) {
      onShowHistory();
      return;
    }

    this.setState({ numberOfVisibleTransactions: 0 });
  }

  renderHistoryItems() {
    const { transactions } = this.props;
    const { numberOfVisibleTransactions } = this.state;

    const visibleTransactions = numberOfVisibleTransactions
      ? transactions.slice(0, numberOfVisibleTransactions)
      : transactions;

    if (this.shouldRenderPlaceholderView()) {
      return this.renderPlaceholderView();
    }

    return (
      <View>
        <ListView
          data={visibleTransactions}
          loading={isBusy(transactions)}
          renderRow={renderTransactionRow}
        />
        {this.renderShowHistoryButton()}
      </View>
    );
  }

  renderShowHistoryButton() {
    const { numberOfVisibleTransactions } = this.state;

    if (!numberOfVisibleTransactions) {
      return null;
    }

    return (
      <Button styleName="md-gutter-vertical" onPress={this.showEntireHistory}>
        <Text>{I18n.t(ext('fullHistoryButton'))}</Text>
      </Button>
    );
  }

  render() {
    return (
      <View>
        <Divider styleName="section-header">
          <Caption>{I18n.t(ext('pointsHistoryTitle'))}</Caption>
        </Divider>
        {this.renderHistoryItems()}
      </View>
    );
  }
}

export default connectStyle(ext('TransactionHistoryView'))(
  TransactionHistoryView,
);
