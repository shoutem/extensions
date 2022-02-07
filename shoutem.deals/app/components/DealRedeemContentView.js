import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import autoBindReact from 'auto-bind/react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { Button, Caption, Divider, Image, Text, View } from '@shoutem/ui';
import { I18n } from 'shoutem.i18n';
import { TRANSLATIONS } from '../const';
import { getLastDealStatusTransaction } from '../redux';
import {
  dealStatusShape,
  getDealActiveCoupon,
  getDealStatus,
  isDealActive,
} from '../services';
import DealRedeemTimer from './DealRedeemTimer';

export class DealRedeemContentView extends PureComponent {
  static propTypes = {
    activeCoupon: PropTypes.object.isRequired,
    deal: PropTypes.object.isRequired,
    dealStatus: dealStatusShape,
    hideRedeemButton: PropTypes.bool,
    isDealActive: PropTypes.bool.isRequired,
    isRedeeming: PropTypes.bool.isRequired,
    onRedeemCoupon: PropTypes.func.isRequired,
    onTimerEnd: PropTypes.func,
  };

  static getDerivedStateFromProps(props, state) {
    const { dealStatus } = props;
    const { dealStatus: oldDealStatus } = state;

    if (_.isEqual(oldDealStatus, dealStatus)) {
      return state;
    }

    return { ...state, dealStatus };
  }

  constructor(props) {
    super(props);

    autoBindReact(this);

    this.state = {
      dealStatus: props.dealStatus,
    };
  }

  handleTimerEnd() {
    const { dealStatus, onTimerEnd } = this.props;

    this.setState({
      dealStatus: {
        ...dealStatus,
        couponClaimed: false,
      },
    });

    if (_.isFunction(onTimerEnd)) {
      onTimerEnd();
    }
  }

  renderBarcodeImage() {
    const {
      deal: { barcode },
    } = this.props;

    if (!barcode) {
      return null;
    }

    return (
      <View styleName="vertical h-center md-gutter">
        <Image source={{ uri: barcode }} styleName="large-ultra-wide" />
      </View>
    );
  }

  renderClaimedState() {
    const {
      activeCoupon,
      deal,
      hideRedeemButton,
      isDealActive,
      isRedeeming,
      onRedeemCoupon,
    } = this.props;

    const {
      dealStatus: { couponClaimed },
    } = this.state;

    const couponExpiresAt = activeCoupon?.expiresAt;
    const hasTimer = activeCoupon && couponClaimed && couponExpiresAt;

    return (
      <View styleName="solid vertical v-center h-center sm-gutter-vertical md-gutter-horizontal">
        <Divider styleName="line md-gutter-horizontal" />
        <Text styleName="lg-gutter-top sm-gutter-bottom">
          {I18n.t(TRANSLATIONS.COUPON_CLAIMED_TEXT)}
        </Text>
        <Caption>{I18n.t(TRANSLATIONS.COUPON_REDEEM_TIME_TEXT)}</Caption>
        {hasTimer && (
          <View styleName="md-gutter-vertical">
            <DealRedeemTimer
              deal={deal}
              endTime={couponExpiresAt}
              styleName="md-gutter-vertical"
              onTimerEnd={this.handleTimerEnd}
            />
          </View>
        )}
        <View styleName="flexible vertical stretch md-gutter-top">
          <Text styleName="bold sm-gutter-bottom">
            {I18n.t(TRANSLATIONS.COUPON_REDEEM_INSTRUCTIONS_TITLE_TEXT)}
          </Text>
          <Text>{I18n.t(TRANSLATIONS.COUPON_REDEEM_INSTRUCTIONS_TEXT)}</Text>
        </View>
        {isDealActive && !hideRedeemButton && (
          <View styleName="md-gutter-top lg-gutter-bottom">
            <Button
              disabled={isRedeeming}
              onPress={onRedeemCoupon}
              styleName={`md-gutter-top ${isRedeeming ? 'muted' : ''}`}
            >
              <Text>{I18n.t(TRANSLATIONS.REDEEM_COUPON_BUTTON)}</Text>
            </Button>
          </View>
        )}
      </View>
    );
  }

  renderRedeemedState() {
    return (
      <View styleName="solid vertical v-center h-center lg-gutter-bottom md-gutter-horizontal">
        <View styleName="lg-gutter-top md-gutter-bottom">
          <Text>{I18n.t(TRANSLATIONS.DEAL_REDEEMED_TEXT)}</Text>
        </View>
        {this.renderBarcodeImage()}
      </View>
    );
  }

  render() {
    const {
      dealStatus: {
        couponClaimed,
        couponsEnabled,
        couponExpired,
        couponRedeemed,
        dealRedeemed,
      },
    } = this.state;

    // If deal or coupon is redeemed, render redeemed information and ignore rest.
    if (couponRedeemed || dealRedeemed) {
      return this.renderRedeemedState();
    }

    if (
      !couponsEnabled ||
      couponExpired ||
      (!couponClaimed && !couponRedeemed)
    ) {
      return null;
    }

    return this.renderClaimedState();
  }
}

export function mapStateToProps(state, ownProps) {
  const { deal } = ownProps;
  const lastDealStatusTransaction = getLastDealStatusTransaction(
    state,
    deal.id,
  );
  const activeCoupon = getDealActiveCoupon(lastDealStatusTransaction);

  return {
    activeCoupon,
    isDealActive: isDealActive(deal),
    dealStatus: getDealStatus(deal, lastDealStatusTransaction),
  };
}

export default connect(mapStateToProps)(DealRedeemContentView);
