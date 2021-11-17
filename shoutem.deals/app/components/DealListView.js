import React, { PureComponent } from 'react';
import autoBindReact from 'auto-bind/react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { connectStyle } from '@shoutem/theme';
import {
  Caption,
  Divider,
  Icon,
  Row,
  Subtitle,
  TouchableOpacity,
  Text,
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

export class DealListView extends PureComponent {
  static propTypes = {
    activeCoupon: PropTypes.object.isRequired,
    deal: PropTypes.object.isRequired,
    dealStatus: dealStatusShape,
    onPress: PropTypes.func.isRequired,
    style: PropTypes.object,
  };

  constructor(props) {
    super(props);

    autoBindReact(this);
  }

  handlePress() {
    const { deal, onPress } = this.props;

    onPress(deal);
  }

  renderClaimedIcon() {
    return <Icon name="checkbox-on" styleName="disclosure" />;
  }

  render() {
    const { deal, dealStatus, style } = this.props;
    const { currency, discountPrice, id, regularPrice, title } = deal;
    const { couponRedeemed, dealRedeemed } = dealStatus;

    const hasDiscountPrice = !!discountPrice;
    const hasRegularPrice = !!regularPrice;
    const hasDiscount = hasDiscountPrice && hasRegularPrice;

    return (
      <TouchableOpacity key={id} onPress={this.handlePress} style={style}>
        <Row>
          <DealImage
            styleName="small rounded-corners"
            deal={deal}
            dealStatus={dealStatus}
            renderTimer={false}
          />
          <View styleName="vertical stretch space-between md-gutter-horizontal">
            <Subtitle>{title}</Subtitle>
            <View styleName="flexible horizontal v-center">
              {hasRegularPrice && !hasDiscount && (
                <Text>{formatPrice(regularPrice, currency)}</Text>
              )}
              {hasDiscount && (
                <View styleName="horizontal v-center">
                  <Text>{`${formatPrice(discountPrice, currency)} `}</Text>
                  <Caption styleName="line-through">
                    {formatPrice(regularPrice, currency)}
                  </Caption>
                </View>
              )}
            </View>
          </View>
          {(couponRedeemed || dealRedeemed) && this.renderClaimedIcon()}
        </Row>
        <Divider styleName="line" />
      </TouchableOpacity>
    );
  }
}

export const mapStateToProps = (state, ownProps) => {
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
    lastDealAction,
    lastDealTransaction,
    lastDealStatusTransaction,
    dealStatus: getDealStatus(deal, lastDealStatusTransaction),
  };
};

export default connect(mapStateToProps)(
  connectStyle(ext('DealListView'), {})(DealListView),
);
