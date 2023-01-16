import React, { PureComponent } from 'react';
import { Linking } from 'react-native';
import { uses24HourClock } from 'react-native-localize';
import { connect } from 'react-redux';
import autoBindReact from 'auto-bind/react';
import _ from 'lodash';
import moment from 'moment';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import {
  Button,
  Caption,
  Divider,
  Icon,
  Image,
  Overlay,
  Row,
  Screen,
  ScrollView,
  ShareButton,
  SimpleHtml,
  Text,
  Title,
  TouchableOpacity,
  View,
} from '@shoutem/ui';
import { authenticate } from 'shoutem.auth';
import { Favorite } from 'shoutem.favorites';
import { I18n } from 'shoutem.i18n';
import {
  composeNavigationStyles,
  getRouteParams,
  withIsFocused,
} from 'shoutem.navigation';
import { openURL } from 'shoutem.web-view';
import DealRedeemContentView from '../components/DealRedeemContentView';
import FooterDealView from '../components/FooterDealView';
import { ext, TRANSLATIONS } from '../const';
import {
  claimCoupon,
  fetchDealTransactions,
  getDeal,
  getLastDealStatusTransaction,
  getLastDealTransaction,
  redeemCoupon,
  redeemDeal,
} from '../redux';
import {
  dealStatusShape,
  formatPrice,
  getDealActiveCoupon,
  getDealStatus,
  getFormattedDiscount,
  isDealActive,
  resolveDealBuyDisplayLink,
  resolveMapScheme,
} from '../services';

const styles = {
  dealCoupons: {
    backgroundColor: '#000000',

    'shoutem.ui.Text': {
      color: '#ffffff',
    },
  },
};

function formatDealDate(dealDateStr, isOnlyEndDate) {
  const dealDate = moment(dealDateStr);
  const timeFormat = uses24HourClock() ? 'H:mm' : 'h:mm a';
  const diffInYears = Math.abs(moment().diff(dealDate, 'years'));
  const yearFormat = diffInYears >= 1 ? 'YYYY' : '';
  const monthFormat = diffInYears >= 1 ? 'MMM' : 'MMMM';

  if (!isOnlyEndDate) {
    return dealDate.format(`${monthFormat} DD ${yearFormat}  • ${timeFormat}`);
  }

  const isMidnight = dealDate.isSame(
    moment(dealDateStr).startOf('day'),
    'hour',
  );
  const weekdayAndDate = dealDate.format(
    `dddd Do ${monthFormat} ${yearFormat}`,
  );

  if (isMidnight) {
    return I18n.t(ext('validUntilLabelWithoutTime'), { weekdayAndDate });
  }

  return I18n.t(ext('validUntilLabelWithTime'), {
    time: dealDate.format(timeFormat),
    weekdayAndDate,
  });
}

export class DealDetailsScreen extends PureComponent {
  static getDerivedStateFromProps(props, state) {
    const newState = {
      ...state,
      dealStatus: props.dealStatus,
    };

    if (props.isFocused) {
      newState.isClaiming = false;
      newState.isRedeeming = false;
    }

    return newState;
  }

  constructor(props) {
    super(props);

    autoBindReact(this);

    this.state = {
      currentGalleryImageIndex: 0,
      dealStatus: props.dealStatus,
      isClaiming: false,
      isRedeeming: false,
    };
  }

  componentDidMount() {
    const {
      deal: { id },
      fetchDealTransactions,
      navigation,
    } = this.props;
    const { catalogId } = getRouteParams(this.props);

    navigation.setOptions(this.getNavBarProps());
    fetchDealTransactions(catalogId, id);
  }

  getNavBarProps() {
    const { deal } = this.props;

    let navigationStyles = '';

    if (this.isNavigationBarClear()) {
      if (deal.image1) {
        navigationStyles = composeNavigationStyles(['clear', 'solidify']);
      } else {
        navigationStyles = composeNavigationStyles(['boxing']);
      }
    }

    return {
      ...navigationStyles,
      headerRight: this.headerRight,
      title: deal.title || '',
    };
  }

  headerRight(props) {
    const { deal } = this.props;
    const { hasFavoriteButton } = getRouteParams(this.props);

    const favorites = hasFavoriteButton ? (
      <Favorite
        iconProps={{ style: props.tintColor }}
        item={deal}
        schema={deal.type}
      />
    ) : null;
    const share = deal.buyLink ? (
      <ShareButton
        iconProps={{ style: props.tintColor }}
        styleName="clear"
        title={deal.title}
        url={deal.buyLink}
      />
    ) : null;

    return (
      <View styleName="horizontal">
        {favorites}
        {share}
      </View>
    );
  }

  isNavigationBarClear() {
    const { screenSettings } = getRouteParams(this.props);
    return screenSettings.navigationBarStyle === 'clear';
  }

  handleClaimCoupon() {
    const { authenticate, claimCoupon, deal } = this.props;
    const { catalogId } = getRouteParams(this.props);

    this.setState({
      isClaiming: true,
    });

    authenticate(() =>
      claimCoupon(catalogId, deal.id)
        .then(() => this.setState({ isClaiming: false }))
        .catch(() => this.setState({ isClaiming: false })),
    );
  }

  handleRedeemCoupon() {
    const { authenticate, activeCoupon, deal, redeemCoupon } = this.props;
    const { catalogId } = getRouteParams(this.props);
    const {
      dealStatus: { couponExpired },
    } = this.state;

    if (!activeCoupon || couponExpired) {
      return;
    }

    this.setState({ isRedeeming: true });
    authenticate(() =>
      redeemCoupon(catalogId, deal.id, activeCoupon.id)
        .then(() => this.setState({ isRedeeming: false }))
        .catch(() => this.setState({ isRedeeming: false })),
    );
  }

  handleRedeemDeal() {
    const { authenticate, deal, redeemDeal } = this.props;
    const { catalogId } = getRouteParams(this.props);

    this.setState({ isRedeeming: true });

    authenticate(() =>
      redeemDeal(catalogId, deal.id)
        .then(() => this.setState({ isRedeeming: false }))
        .catch(() => this.setState({ isRedeeming: false })),
    );
  }

  handleOpenDealDetails(deal) {
    const { onOpenDealDetails } = getRouteParams(this.props);

    onOpenDealDetails(deal);
  }

  handleOpenWebsite() {
    const { deal } = this.props;

    if (!deal.buyLink) {
      return;
    }

    openURL(deal.buyLink, deal.buyLinkTitle);
  }

  handleOpenDirections() {
    const { deal } = this.props;

    const mapScheme = resolveMapScheme(deal);

    if (mapScheme) {
      Linking.openURL(mapScheme);
    }
  }

  handleTimerEnd() {
    const { dealStatus } = this.state;

    this.setState({
      dealStatus: {
        ...dealStatus,
        couponClaimed: false,
      },
    });
  }

  renderBarcodeImage() {
    const {
      deal: { barcode },
    } = this.props;

    if (!barcode) {
      return null;
    }

    return (
      <View styleName="vertical h-center md-gutter-horizontal">
        <Image source={{ uri: barcode }} styleName="large-ultra-wide" />
      </View>
    );
  }

  renderBuyLink() {
    const { deal } = this.props;

    if (!deal.buyLink) {
      return null;
    }

    const displayedLink = resolveDealBuyDisplayLink(deal.buyLink);

    return (
      <TouchableOpacity onPress={this.handleOpenWebsite}>
        <Divider styleName="line" />
        <Row styleName="small">
          <Icon name="web" />
          <View>
            <Text>
              {deal.buyLinkTitle || I18n.t(TRANSLATIONS.VISIT_WEBSITE_LABEL)}
            </Text>
            <Caption>{displayedLink}</Caption>
          </View>
          <Icon styleName="disclosure" name="right-arrow" />
        </Row>
      </TouchableOpacity>
    );
  }

  renderClaimButton() {
    const { deal, isDealActive } = this.props;
    const {
      dealStatus: {
        couponsEnabled,
        couponClaimed,
        couponRedeemed,
        dealRedeemed,
      },
    } = this.state;

    const remainingCoupons = _.get(deal, 'remainingCoupons');

    /**
     * In case that "remainingCoupons" is undefined, treat this state as
     * unlimited number of coupons.
     * This logic will be checked only if coupons are actually enabled.
     */
    const hasRemainingCoupons = !_.isUndefined(remainingCoupons)
      ? remainingCoupons > 0
      : true;

    if (!isDealActive) {
      return null;
    }

    if (couponsEnabled) {
      if (!hasRemainingCoupons || couponRedeemed) {
        return null;
      }

      if (!couponClaimed) {
        const { isClaiming } = this.state;

        return (
          <Button
            disabled={isClaiming}
            onPress={this.handleClaimCoupon}
            styleName={`lg-gutter-top ${isClaiming ? 'muted' : ''}`}
          >
            <Icon name="checkbox-on" />
            <Text>{I18n.t(TRANSLATIONS.CLAIM_COUPON_BUTTON)}</Text>
          </Button>
        );
      }

      return null;
    }

    if (deal?.hideRedeemButton || dealRedeemed) {
      return null;
    }

    const { isRedeeming } = this.state;

    return (
      <Button
        disabled={isRedeeming}
        onPress={this.handleRedeemDeal}
        styleName={`lg-gutter-top ${isRedeeming ? 'muted' : ''}`}
      >
        <Icon name="checkbox-on" />
        <Text>{I18n.t(TRANSLATIONS.REDEEM_DEAL_BUTTON)}</Text>
      </Button>
    );
  }

  renderContent() {
    const { deal } = this.props;

    return (
      <View styleName="solid">
        {this.renderRedeemContent()}

        {!_.isEmpty(deal.description) &&
          this.renderDealDescription(
            I18n.t(TRANSLATIONS.DEAL_DESCRIPTION_HEADING),
            deal.description,
          )}

        {!_.isEmpty(deal.condition) &&
          this.renderDealDescription(
            I18n.t(TRANSLATIONS.DEAL_CONDITIONS_HEADING),
            deal.condition,
          )}
      </View>
    );
  }

  renderDealCouponsCount() {
    const { deal } = this.props;
    const {
      dealStatus: { couponsEnabled },
    } = this.state;

    if (!couponsEnabled) {
      return null;
    }

    const remainingCoupons = _.get(deal, ['remainingCoupons'], 0);

    if (remainingCoupons <= 0) {
      return null;
    }

    return (
      <View style={styles.dealCoupons} styleName="vertical h-center">
        <Text styleName="md-gutter-vertical">
          {_.toUpper(
            I18n.t(TRANSLATIONS.REMAINING_COUPONS, {
              count: remainingCoupons,
            }),
          )}
        </Text>
      </View>
    );
  }

  renderDealDetails(darkBackground = false) {
    const { deal } = this.props;

    const textColorStyle = darkBackground ? 'secondary' : '';
    const {
      title,
      regularPrice,
      discountPrice,
      currency,
      startTime,
      endTime,
    } = deal;

    const hasDiscountPrice = !!discountPrice;
    const hasRegularPrice = !!regularPrice;
    const hasDiscount = hasDiscountPrice && hasRegularPrice;

    return (
      <View styleName="lg-gutter-bottom middleCenter" pointerEvents="box-none">
        {hasDiscount && (
          <Overlay styleName="rounded-corners">
            <Title styleName={`h-center ${textColorStyle}`}>
              {getFormattedDiscount(deal)}
            </Title>
          </Overlay>
        )}

        <Title styleName={`lg-gutter-vertical h-center ${textColorStyle}`}>
          {_.toUpper(title)}
        </Title>
        {hasDiscount && (
          <>
            <Text
              styleName={`sm-gutter-bottom h-center line-through ${textColorStyle}`}
            >
              {formatPrice(regularPrice, currency)}
            </Text>
            <Title styleName={`lg-gutter-bottom h-center ${textColorStyle}`}>
              {formatPrice(discountPrice, currency)}
            </Title>
          </>
        )}
        {hasRegularPrice && !hasDiscount && (
          <Title styleName={`lg-gutter-bottom h-center ${textColorStyle}`}>
            {formatPrice(discountPrice, currency)}
          </Title>
        )}
        {!!startTime && (
          <>
            <Text
              styleName={`h-center dimmed md-gutter-bottom ${textColorStyle}`}
            >
              {formatDealDate(startTime)}
            </Text>
            <Divider styleName="line small md-gutter-vertical center" />
          </>
        )}
        <Text
          styleName={`h-center dimmed ${
            startTime ? 'md-gutter-top' : ''
          } ${textColorStyle}`}
        >
          {formatDealDate(endTime, !startTime)}
        </Text>

        {this.renderClaimButton()}
      </View>
    );
  }

  renderDealDescription(title, description) {
    if (!description) {
      return null;
    }

    return (
      <View>
        <Divider styleName="line section-header">
          <Text styleName="md-gutter-horizontal sm-gutter-bottom">{title}</Text>
        </Divider>
        <SimpleHtml body={description} />
      </View>
    );
  }

  renderDealImage() {}

  renderDirections() {
    const { deal } = this.props;
    const { place } = deal;

    return place ? (
      <TouchableOpacity onPress={this.handleOpenDirections}>
        <Divider styleName="line" />
        <Row styleName="small">
          <Icon name="address" />
          <View>
            <Text>{I18n.t(TRANSLATIONS.DEAL_LOCATION_DIRECTIONS_LABEL)}</Text>
            <Caption>{_.get(deal, 'place.location.formattedAddress')}</Caption>
          </View>
          <Icon styleName="disclosure" name="right-arrow" />
        </Row>
      </TouchableOpacity>
    ) : null;
  }

  renderHeader() {
    return (
      <View>
        {this.renderDealImage()}
        {this.renderDealCouponsCount()}
      </View>
    );
  }

  renderFooter() {
    const { nextDeal, previousDeal } = getRouteParams(this.props);

    return (
      <View>
        {this.renderBuyLink()}
        {this.renderDirections()}

        <View styleName="md-gutter-top horizontal space-between">
          {previousDeal && (
            <FooterDealView
              deal={previousDeal}
              label={I18n.t(TRANSLATIONS.PREVIOUS_DEAL_LABEL)}
              onPress={this.handleOpenDealDetails}
            />
          )}

          {nextDeal && (
            <FooterDealView
              deal={nextDeal}
              label={I18n.t(TRANSLATIONS.NEXT_DEAL_LABEL)}
              onPress={this.handleOpenDealDetails}
            />
          )}
        </View>
      </View>
    );
  }

  renderRedeemContent() {
    const { deal } = this.props;
    const { isRedeeming } = this.state;

    return (
      <DealRedeemContentView
        deal={deal}
        isRedeeming={isRedeeming}
        hideRedeemButton={deal?.hideRedeemButton}
        onRedeemCoupon={this.handleRedeemCoupon}
        onTimerEnd={this.handleTimerEnd}
      />
    );
  }

  render() {
    return (
      <Screen>
        <ScrollView>
          {this.renderHeader()}
          {this.renderContent()}
          {this.renderFooter()}
        </ScrollView>
      </Screen>
    );
  }
}

DealDetailsScreen.propTypes = {
  navigation: PropTypes.object.isRequired,
  activeCoupon: PropTypes.object,
  authenticate: PropTypes.func,
  claimCoupon: PropTypes.func,
  deal: PropTypes.object,
  dealStatus: dealStatusShape,
  fetchDealTransactions: PropTypes.func,
  hasFavoriteButton: PropTypes.bool,
  isDealActive: PropTypes.bool,
  isFocused: PropTypes.bool,
  nextDeal: PropTypes.object,
  previousDeal: PropTypes.object,
  redeemCoupon: PropTypes.func,
  redeemDeal: PropTypes.func,
};

DealDetailsScreen.defaultProps = {
  activeCoupon: {},
  authenticate: undefined,
  claimCoupon: undefined,
  deal: {},
  dealStatus: undefined,
  fetchDealTransactions: undefined,
  hasFavoriteButton: true,
  isDealActive: false,
  isFocused: false,
  nextDeal: {},
  previousDeal: {},
  redeemCoupon: undefined,
  redeemDeal: undefined,
};

export function mapStateToProps(state, ownProps) {
  const { deal } = getRouteParams(ownProps);
  const lastDealTransaction = getLastDealTransaction(state, deal.id);
  const lastDealStatusTransaction = getLastDealStatusTransaction(
    state,
    deal.id,
  );
  const activeCoupon = getDealActiveCoupon(lastDealStatusTransaction);

  return {
    activeCoupon,

    // Doing this in order to reload deal object in case anything changed in state.
    // For some reason, it doesn't propagate updates to and from deals list.
    deal: getDeal(state, deal.id),
    isDealActive: isDealActive(deal),
    lastDealTransaction,
    lastDealStatusTransaction,
    dealStatus: getDealStatus(deal, lastDealStatusTransaction),
  };
}

export function mapDispatchToProps(dispatch) {
  return {
    authenticate: callback => dispatch(authenticate(callback)),
    claimCoupon: (catalogId, dealId) =>
      dispatch(claimCoupon(catalogId, dealId)),
    fetchDealTransactions: (catalogId, dealId) =>
      dispatch(fetchDealTransactions(catalogId, dealId)),
    redeemCoupon: (catalogId, dealId, couponId) =>
      dispatch(redeemCoupon(catalogId, dealId, couponId)),
    redeemDeal: (catalogId, dealId) => dispatch(redeemDeal(catalogId, dealId)),
  };
}

export default withIsFocused(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )(connectStyle(ext('DealDetailsScreen', {}))(DealDetailsScreen)),
);
