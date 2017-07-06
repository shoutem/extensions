import React from 'react';

import moment from 'moment';

import {
  Caption,
  Divider,
  Icon,
  Row,
  Text,
  View,
} from '@shoutem/ui';

import { connectStyle } from '@shoutem/theme';

import { ext } from '../const';
import { transaction as transactionShape } from '../components/shapes';

const TRANSACTION_DATE_FORMAT = 'MMMM DD';

/**
 * A points card transaction item, used to display transaction history
 */
const TransactionItem = ({ transaction }) => {
  const { createdAt, transactionData: { points } } = transaction;

  const isRedeemed = points < 0;

  const label = isRedeemed ? `${-points} redeemed` : `${points} added`;

  return (
    <View>
      <Row styleName="small">
        <Icon name={isRedeemed ? 'gift' : 'plus-button'} />
        <Text styleName="h-center">{label}</Text>
        <Caption styleName="h-right">
          {moment(createdAt).format(TRANSACTION_DATE_FORMAT)}
        </Caption>
      </Row>
      <Divider styleName="line" />
    </View>
  );
};

TransactionItem.propTypes = {
  // The transaction
  transaction: transactionShape.isRequired,
};

export default connectStyle(ext('TransactionItem'))(TransactionItem);
