import _ from 'lodash';

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';

import {
  Button,
  Caption,
  Divider,
  Image,
  Text,
  View,
} from '@shoutem/ui';
import { I18n } from 'shoutem.i18n';

import { TRANSLATIONS } from '../const';
import {
  dealStatusShape,
  getDealActiveCoupon,
  getDealStatus,
  isDealActive,
} from '../services';
import {
  getLastDealStatusTransaction,
} from '../redux';
import DealRedeemTimer from './DealRedeemTimer';

export class DealRedeemContentView extends PureComponent {

  static propTypes = {
    activeCoupon: PropTypes.object,
    deal: PropTypes.object,
    dealStatus: dealStatusShape,
    isDealActive: PropTypes.bool,
    isRedeeming: PropTypes.bool,
    onRedeemCoupon: PropTypes.func,
    onTimerEnd: PropTypes.func,
  }

  constructor(props) {
    super(props);

    this.handleTimerEnd = this.handleTimerEnd.bind(this);

    this.state = {
      dealStatus: props.dealStatus,
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      dealStatus: nextProps.dealStatus,
    });
  }

  handleTimerEnd() {
    const { dealStatus } = this.props;

    this.setState({
      dealStatus: {
        ...dealStatus,
        couponClaimed: false,
      },
    });

    if (_.isFunction(this.props.onTimerEnd)) {
      this.props.onTimerEnd();
    }
  }

  renderBarcodeImage() {
    const { deal: { barcode } } = this.props;

    if (!barcode) {
      return null;
    }

    return (
      <View styleName="vertical h-center md-gutter-horizontal">
        <Image
          source={{ uri: barcode }}
          styleName="large-ultra-wide"
        />
      </View>
    );
  }

  renderClaimedState() {
    const {
      activeCoupon,
      deal,
    } = this.props;

    const {
      dealStatus: {
        couponClaimed,
      },
    } = this.state;

    const couponExpiresAt = _.get(activeCoupon, 'expiresAt');
    const hasTimer = (activeCoupon && couponClaimed && couponExpiresAt);

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

        {this.props.isDealActive && (
          <View styleName="md-gutter-top lg-gutter-bottom">
            <Button
              disabled={this.props.isRedeeming}
              onPress={this.props.onRedeemCoupon}
              styleName={`md-gutter-top ${this.props.isRedeeming ? 'muted' : ''}`}
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

        <View styleName="md-gutter-vertical">
          {this.renderBarcodeImage()}
        </View>
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

    if (!couponsEnabled || couponExpired || (!couponClaimed && !couponRedeemed)) {
      return null;
    }

    return this.renderClaimedState();
  }
}

export const mapStateToProps = (state, ownProps) => {
  const { deal } = ownProps;
  const lastDealStatusTransaction = getLastDealStatusTransaction(state, deal.id);
  const activeCoupon = getDealActiveCoupon(lastDealStatusTransaction);

  return {
    activeCoupon,
    isDealActive: isDealActive(deal),
    dealStatus: getDealStatus(deal, lastDealStatusTransaction),
  };
};

export default connect(mapStateToProps)(DealRedeemContentView);
