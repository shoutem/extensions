import React, { PureComponent } from 'react';
import moment from 'moment';
import { connectStyle } from '@shoutem/theme';
import { Caption, Divider, Image, Row, Subtitle, View } from '@shoutem/ui';
import { I18n } from 'shoutem.i18n';
import { ext } from '../const';
import { transactionShape } from './shapes';

const TRANSACTION_DATE_FORMAT = 'MMMM DD';

const GIFT_ICON = require('../assets/icons/gift.png');
const PLUS_ICON = require('../assets/icons/plus.png');

/**
 * A points card transaction item, used to display transaction history
 */
class TransactionItem extends PureComponent {
  static propTypes = {
    // The transaction
    transaction: transactionShape.isRequired,
  };

  render() {
    const { transaction } = this.props;
    const { createdAt, transactionData } = transaction;
    const { points, purchase, rewardName = '', visit } = transactionData;

    const isRedeemed = points < 0;
    const action = isRedeemed
      ? I18n.t(ext('rewardRedeemed'))
      : I18n.t(ext('historyItemPointsGainedTitle'));
    const purchased = purchase
      ? I18n.t(ext('historyItemAmountSpent'), {
          amountSpent: transactionData.amount,
        })
      : '';
    const visited = visit ? I18n.t(ext('historyItemStoreVisited')) : '';
    const activity = `${visited}${purchased}`;
    const actionSubtitle = isRedeemed ? rewardName : activity;
    const date = moment(createdAt).format(TRANSACTION_DATE_FORMAT);

    return (
      <View>
        <Row>
          <Image
            source={isRedeemed ? GIFT_ICON : PLUS_ICON}
            styleName="small-avatar"
          />
          <View style={{ flex: 6 }} styleName="vertical stretch space-between">
            <Subtitle>{action}</Subtitle>
            <View styleName="horizontal">
              <Caption>{`${date}  ·  ${actionSubtitle}`}</Caption>
            </View>
          </View>
          <Subtitle style={{ flex: 1 }} styleName="h-right">
            {`${isRedeemed ? '' : '+'}${points}`}
          </Subtitle>
        </Row>
        <Divider styleName="line" />
      </View>
    );
  }
}

export default connectStyle(ext('TransactionItem'))(TransactionItem);
