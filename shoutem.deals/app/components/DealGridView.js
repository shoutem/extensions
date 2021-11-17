import React, { PureComponent } from 'react';
import autoBindReact from 'auto-bind/react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { connectStyle } from '@shoutem/theme';
import {
  Caption,
  Card,
  Text,
  TouchableOpacity,
  Subtitle,
  View,
} from '@shoutem/ui';
import { ext } from '../const';
import {
  getDeal,
  getLastDealAction,
  getLastDealTransaction,
  getLastDealStatusTransaction,
} from '../redux';
import {
  dealStatusShape,
  formatPrice,
  getDealActiveCoupon,
  getDealStatus,
} from '../services';
import DealImage from './DealImage';

export class DealGridView extends PureComponent {
  static propTypes = {
    activeCoupon: PropTypes.object.isRequired,
    dealId: PropTypes.string.isRequired,
    deal: PropTypes.object.isRequired,
    dealStatus: dealStatusShape,
    onPress: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    autoBindReact(this);
  }

  handlePress() {
    const { deal, onPress } = this.props;

    onPress(deal);
  }

  render() {
    const { activeCoupon, deal, dealStatus } = this.props;
    const { currency, discountPrice, regularPrice, title } = deal;

    const hasDiscountPrice = !!discountPrice;
    const hasRegularPrice = !!regularPrice;
    const hasDiscount = hasDiscountPrice && hasRegularPrice;

    return (
      <TouchableOpacity onPress={this.handlePress}>
        <Card styleName="flexible">
          <DealImage
            activeCoupon={activeCoupon}
            deal={deal}
            dealStatus={dealStatus}
            styleName="medium-wide"
          />

          <View styleName="content space-between">
            <Subtitle numberOfLines={3}>{title}</Subtitle>
            <View styleName="md-gutter-top flexbox">
              <View styleName="flexible horizontal space-between">
                <Text>
                  {hasRegularPrice && !hasDiscount && (
                    <Text>{formatPrice(regularPrice, currency)}</Text>
                  )}
                  {hasDiscount && (
                    <>
                      <Text>{`${formatPrice(discountPrice, currency)} `}</Text>
                      <Caption styleName={!!discountPrice && 'line-through'}>
                        {formatPrice(regularPrice, currency)}
                      </Caption>
                    </>
                  )}
                </Text>
              </View>
            </View>
          </View>
        </Card>
      </TouchableOpacity>
    );
  }
}

export function mapStateToProps(state, ownProps) {
  const { deal } = ownProps;
  const lastDealTransaction = getLastDealTransaction(state, deal.id);
  const lastDealStatusTransaction = getLastDealStatusTransaction(
    state,
    deal.id,
  );
  const lastDealAction = getLastDealAction(state, deal.id);
  const activeCoupon = getDealActiveCoupon(lastDealStatusTransaction);

  return {
    activeCoupon,
    deal: getDeal(state, deal.id),
    dealStatus: getDealStatus(deal, lastDealStatusTransaction),
    lastDealAction,
    lastDealTransaction,
    lastDealStatusTransaction,
  };
}

export default connect(mapStateToProps)(
  connectStyle(ext('DealGridView'), {})(DealGridView),
);
