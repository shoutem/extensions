import React, { PureComponent } from 'react';
import autoBindReact from 'auto-bind/react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { connectStyle } from '@shoutem/theme';
import {
  Icon,
  Overlay,
  Text,
  Tile,
  Title,
  TouchableOpacity,
  View,
} from '@shoutem/ui';
import {
  getLastDealAction,
  getLastDealTransaction,
  getLastDealStatusTransaction,
} from '../redux';
import {
  dealStatusShape,
  formatPrice,
  getDealActiveCoupon,
  getDealStatus,
  getFormattedDiscount,
} from '../services';
import { ext } from '../const';
import DealImage from './DealImage';
import DealRedeemTimer from './DealRedeemTimer';

export class FeaturedDealView extends PureComponent {
  static propTypes = {
    activeCoupon: PropTypes.object,
    dealId: PropTypes.string,
    deal: PropTypes.object,
    dealStatus: dealStatusShape,
    onPress: PropTypes.func,
    styleName: PropTypes.string,
  };

  static defaultProps = {
    onPress: () => {},
  };

  constructor(props) {
    super(props);

    autoBindReact(this);
  }

  handlePress() {
    this.props.onPress(this.props.deal);
  }

  render() {
    const {
      activeCoupon,
      dealStatus: { couponClaimed, couponRedeemed, dealRedeemed },
      deal,
      styleName,
    } = this.props;
    const { currency, discountPrice, regularPrice, title } = deal;

    const hasDiscountPrice = !!discountPrice;
    const hasRegularPrice = !!regularPrice;
    const hasDiscount = hasDiscountPrice && hasRegularPrice;

    const containerStyleName = `sm-gutter ${styleName || ''}`;
    const couponExpiresAt = _.get(activeCoupon, 'expiresAt');
    const hasTimer = activeCoupon && couponClaimed && couponExpiresAt;

    return (
      <TouchableOpacity key={deal.id} onPress={this.handlePress}>
        <View styleName={containerStyleName}>
          <DealImage styleName="featured" deal={deal} renderTimer={false}>
            <Tile styleName="h-center">
              {hasDiscount && (
                <Overlay>
                  <Title styleName="h-center">
                    {getFormattedDiscount(deal)}
                  </Title>
                </Overlay>
              )}
              <Title styleName="lg-gutter-vertical h-center">
                {_.toUpper(title)}
              </Title>
              {hasDiscount && (
                <>
                  <Text styleName="sm-gutter-bottom line-through h-center">
                    {formatPrice(regularPrice, currency)}
                  </Text>
                  <Title styleName="lg-gutter-bottom h-center">
                    {formatPrice(discountPrice, currency)}
                  </Title>
                </>
              )}
              {hasRegularPrice && !hasDiscount && (
                <Title styleName="lg-gutter-bottom h-center">
                  {formatPrice(regularPrice, currency)}
                </Title>
              )}
              {hasTimer && (
                <DealRedeemTimer
                  deal={deal}
                  endTime={couponExpiresAt}
                  styleName="md-gutter-vertical"
                />
              )}
              {(couponRedeemed || dealRedeemed) && <Icon name="checkbox-on" />}
            </Tile>
          </DealImage>
        </View>
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
    lastDealAction,
    lastDealTransaction,
    lastDealStatusTransaction,
    dealStatus: getDealStatus(deal, lastDealStatusTransaction),
  };
}

export default connect(mapStateToProps)(
  connectStyle(ext('FeaturedDealView'), {})(FeaturedDealView),
);
