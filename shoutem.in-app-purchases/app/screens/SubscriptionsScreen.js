import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { Alert } from 'react-native';
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
} from '@shoutem/ui';
import { connectStyle } from '@shoutem/theme';
import { NavigationBar, isScreenActive } from 'shoutem.navigation';
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
    isScreenActive: PropTypes.bool,
  };

  constructor(props, contex) {
    super(props, contex);

    autoBind(this);

    this.state = {
      loading: false,
      modalActive: false,
      productHasTrial: _.get(props.subscriptionProduct, 'subscriptionPeriodType') === 'trial',
    };
  }

  componentDidUpdate(prevProps) {
    const {
      hasActiveProduct,
      onSubscriptionObtained,
      isScreenActive,
    } = this.props;
    const { hasActiveProduct: prevHasActiveProduct } = prevProps;

    if (!prevHasActiveProduct && hasActiveProduct && isScreenActive) {
      this.setState({ modalActive: true });
    }

    if (!prevHasActiveProduct && hasActiveProduct && !isScreenActive) {
      onSubscriptionObtained();
    }
  }

  handlePrivacyPolicyPress() {
    const { privacyPolicyUrl, openURL } = this.props;

    openURL(privacyPolicyUrl);
  }

  handleTermsPress() {
    const { termsOfServiceUrl, openURL } = this.props;

    openURL(termsOfServiceUrl);
  }

  handleSuccessModalConfirm() {
    const { onSubscriptionObtained } = this.props;

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

  setLoadingState(loading) {
    this.setState({ loading });
  }

  render() {
    const {
      style,
      subscriptionProduct,
      privacyPolicyUrl,
      termsOfServiceUrl,
      subscriptionMetadata,
    } = this.props;
    const {
      loading,
      modalActive,
      productHasTrial,
    } = this.state;

    const trialDuration = formatTrialDuration(subscriptionProduct);
    const purchaseSuccessDescription = productHasTrial
      ? subscriptionMetadata.confirmationMessageTrial
      : subscriptionMetadata.confirmationMessageRegular;

    return (
      <Screen styleName="paper with-notch-padding">
        <NavigationBar title={subscriptionMetadata.subscriptionScreenTitle} />
        <Text style={style.leadingText}>
          {subscriptionMetadata.subscriptionScreenDescription}
        </Text>
        <View style={style.container}>
          <Image
            resizeMode='contain'
            style={style.image}
            source={{ uri: subscriptionMetadata.subscriptionScreenImageUrl }}
          />
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
            {trialDuration && <Text style={style.trialText}>{trialDuration}</Text>}
            <Button
              disabled={loading || isPreviewApp}
              style={[style.button, style.buttonSecondary]}
              onPress={this.handleRestorePress}
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
            privacyPolicyUrl={privacyPolicyUrl}
            termsOfServiceUrl={termsOfServiceUrl}
            onPrivacyPolicyPress={this.handlePrivacyPolicyPress}
            onTermsPress={this.handleTermsPress}
          />
        </View>
        <SuccessModal
          visible={modalActive}
          title={I18n.t(ext('subscribeSuccessModalTitle'))}
          description={purchaseSuccessDescription}
          buttonText={I18n.t(ext('startExploringButton'))}
          onButtonPress={this.handleSuccessModalConfirm}
        />
      </Screen>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const productId = selectors.getSubscriptionProductId(state);

  return {
    hasActiveProduct: selectors.hasActiveProduct(productId, state),
    productId,
    subscriptionProduct: selectors.getAvailableProduct(productId, state),
    privacyPolicyUrl: selectors.getPrivacyPolicyLink(state),
    termsOfServiceUrl: selectors.getTermsOfServiceLink(state),
    subscriptionMetadata: selectors.getSubscriptionMetadata(state),
    isScreenActive: isScreenActive(state, ownProps.screenId),
  }
};

const mapDispatchToProps = {
  buyProduct: actions.buyProduct,
  restorePurchases: actions.restorePurchases,
  openURL,
};

export default connect(mapStateToProps, mapDispatchToProps)(
  connectStyle(ext('SubscriptionsScreen'))(SubscriptionsScreen),
);
