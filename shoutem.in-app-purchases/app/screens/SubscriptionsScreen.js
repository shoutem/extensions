import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { Alert, ScrollView } from 'react-native';
import _ from 'lodash';
import autoBind from 'auto-bind';
import { connect } from 'react-redux';
import {
  Screen,
  Button,
  Text,
  Image,
  View,
  Spinner,
  LinearGradient,
} from '@shoutem/ui';
import { connectStyle } from '@shoutem/theme';
import { getRouteParams, HeaderBackButton } from 'shoutem.navigation';
import { isPreviewApp } from 'shoutem.preview';
import { I18n } from 'shoutem.i18n';
import { openURL } from 'shoutem.web-view';
import { TermsAndPolicy, SuccessModal } from '../components';
import { actions, selectors } from '../redux';
import {
  formatTrialDuration,
  formatSubscribeMessage,
  formatPurchaseError,
  formatRestoreError,
} from '../services';
import { ext } from '../const';

class SubscriptionsScreen extends PureComponent {
  static propTypes = {
    onSubscriptionObtained: PropTypes.func,
    buyProduct: PropTypes.func,
    restorePurchases: PropTypes.func,
    hasActiveProduct: PropTypes.bool,
    subscriptionProduct: PropTypes.object,
    privacyPolicyUrl: PropTypes.string,
    termsOfServiceUrl: PropTypes.string,
    subscriptionMetadata: PropTypes.object,
    productId: PropTypes.string,
    isScreenActive: PropTypes.bool,
    style: PropTypes.any,
  };

  constructor(props, contex) {
    super(props, contex);

    autoBind(this);

    this.state = {
      loading: false,
      modalActive: false,
      productHasTrial:
        _.get(props.subscriptionProduct, 'subscriptionPeriodType') === 'trial',
    };
  }

  componentDidMount() {
    const { navigation, subscriptionMetadata } = this.props;

    navigation.setOptions({
      title: subscriptionMetadata.subscriptionScreenTitle,
      headerLeft: this.renderBackButton,
    });
  }

  componentDidUpdate(prevProps) {
    const { hasActiveProduct } = this.props;
    const { hasActiveProduct: prevHasActiveProduct } = prevProps;

    if (!prevHasActiveProduct && hasActiveProduct) {
      this.setState({ modalActive: true });
    }
  }

  renderBackButton(props) {
    const { canGoBack } = getRouteParams(this.props);

    if (!canGoBack) {
      return null;
    }

    return <HeaderBackButton {...props} />;
  }

  setLoadingState(loading) {
    this.setState({ loading });
  }

  handleSuccessModalConfirm() {
    const { onSubscriptionObtained } = getRouteParams(this.props);

    this.setState({ modalActive: false });
    onSubscriptionObtained();
  }

  handleBuyPress() {
    const { productId, buyProduct } = this.props;

    this.setLoadingState(true);

    buyProduct(productId)
      .then(() => this.setLoadingState(false))
      .catch(err => {
        this.setLoadingState(false);
        formatPurchaseError(err);
      });
  }

  handleRestorePress() {
    const { restorePurchases, hasActiveProduct } = this.props;

    this.setLoadingState(true);
    restorePurchases()
      .then(() => {
        this.setLoadingState(false);
        if (!hasActiveProduct) {
          Alert.alert(
            I18n.t(ext('restoreNoProductsTitle')),
            I18n.t(ext('restoreNoProductsDescription')),
          );
        }
      })
      .catch(() => {
        this.setLoadingState(false);
        formatRestoreError();
      });
  }

  handleTermsPress() {
    const { termsOfServiceUrl } = this.props;

    openURL(termsOfServiceUrl);
  }

  handlePrivacyPolicyPress() {
    const { privacyPolicyUrl } = this.props;

    openURL(privacyPolicyUrl);
  }

  render() {
    const {
      style,
      subscriptionProduct,
      privacyPolicyUrl,
      termsOfServiceUrl,
      subscriptionMetadata,
    } = this.props;
    const { loading, modalActive, productHasTrial } = this.state;

    const trialDuration = formatTrialDuration(subscriptionProduct);
    const purchaseSuccessDescription = productHasTrial
      ? subscriptionMetadata.confirmationMessageTrial
      : subscriptionMetadata.confirmationMessageRegular;

    return (
      <Screen styleName="paper with-notch-padding">
        <View styleName="flexible">
          <ScrollView contentContainerStyle={style.scrollContainer}>
            <Text style={style.leadingText}>
              {subscriptionMetadata.subscriptionScreenDescription}
            </Text>
            <Image
              resizeMode="contain"
              source={{ uri: subscriptionMetadata.subscriptionScreenImageUrl }}
              style={style.image}
            />
          </ScrollView>
          <LinearGradient
            pointerEvents="box-none"
            style={style.scrollGradient}
          />
        </View>
        <View style={style.buttonContainer}>
          <Button
            disabled={loading || isPreviewApp}
            onPress={this.handleBuyPress}
            style={style.button}
          >
            {!loading && (
              <Text style={style.buttonText}>
                {formatSubscribeMessage(subscriptionProduct)}
              </Text>
            )}
            {loading && <Spinner style={style.spinner} />}
          </Button>
          {trialDuration && (
            <Text style={style.trialText}>{trialDuration}</Text>
          )}
          <Button
            disabled={loading || isPreviewApp}
            onPress={this.handleRestorePress}
            style={[style.button, style.buttonSecondary]}
          >
            {!loading && (
              <Text style={[style.buttonText, style.buttonTextSecondary]}>
                {I18n.t(ext('restoreButtonTitle'))}
              </Text>
            )}
            {loading && <Spinner style={style.spinnerSecondary} />}
          </Button>
        </View>
        <TermsAndPolicy
          onPrivacyPolicyPress={this.handlePrivacyPolicyPress}
          onTermsPress={this.handleTermsPress}
          privacyPolicyUrl={privacyPolicyUrl}
          termsOfServiceUrl={termsOfServiceUrl}
        />
        <SuccessModal
          buttonText={I18n.t(ext('startExploringButton'))}
          description={purchaseSuccessDescription}
          onButtonPress={this.handleSuccessModalConfirm}
          title={I18n.t(ext('subscribeSuccessModalTitle'))}
          visible={modalActive}
        />
      </Screen>
    );
  }
}

const mapStateToProps = state => {
  const productId = selectors.getSubscriptionProductId(state);

  return {
    hasActiveProduct: selectors.hasActiveProduct(productId, state),
    productId,
    subscriptionProduct: selectors.getAvailableProduct(productId, state),
    privacyPolicyUrl: selectors.getPrivacyPolicyLink(state),
    termsOfServiceUrl: selectors.getTermsOfServiceLink(state),
    subscriptionMetadata: selectors.getSubscriptionMetadata(state),
  };
};

const mapDispatchToProps = {
  buyProduct: actions.buyProduct,
  restorePurchases: actions.restorePurchases,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(connectStyle(ext('SubscriptionsScreen'))(SubscriptionsScreen));
