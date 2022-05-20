import React, { PureComponent } from 'react';
import { Alert, ScrollView } from 'react-native';
import { connect } from 'react-redux';
import autoBind from 'auto-bind';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import {
  Button,
  Image,
  LinearGradient,
  Screen,
  Spinner,
  Text,
  View,
} from '@shoutem/ui';
import { I18n } from 'shoutem.i18n';
import { getRouteParams, HeaderBackButton } from 'shoutem.navigation';
import { isPreviewApp } from 'shoutem.preview';
import { openURL } from 'shoutem.web-view';
import { SuccessModal, TermsAndPolicy } from '../components';
import { ext } from '../const';
import { actions, selectors } from '../redux';
import {
  formatPurchaseError,
  formatRestoreError,
  formatSubscribeMessage,
  formatTrialDuration,
} from '../services';

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
    });
  }

  componentDidUpdate(prevProps) {
    const { hasActiveProduct } = this.props;
    const { hasActiveProduct: prevHasActiveProduct } = prevProps;

    if (!prevHasActiveProduct && hasActiveProduct) {
      this.setState({ modalActive: true });
    }
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

    openURL(
      termsOfServiceUrl,
      '',
      true,
      false,
      {},
      { skipSubscriptionPrompt: true },
    );
  }

  handlePrivacyPolicyPress() {
    const { privacyPolicyUrl } = this.props;

    openURL(
      privacyPolicyUrl,
      '',
      true,
      false,
      {},
      { skipSubscriptionPrompt: true },
    );
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
