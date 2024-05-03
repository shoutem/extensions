import React, { PureComponent } from 'react';
import { Alert, ScrollView } from 'react-native';
import { connect } from 'react-redux';
import autoBindReact from 'auto-bind/react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import {
  Button,
  Image,
  LinearGradient,
  Screen,
  SimpleHtml,
  Spinner,
  Text,
  View,
} from '@shoutem/ui';
import { I18n } from 'shoutem.i18n';
import { getRouteParams, navigateTo } from 'shoutem.navigation';
import { isPreviewApp } from 'shoutem.preview';
import { openURL } from 'shoutem.web-view';
import { TermsAndPolicy } from '../components';
import { ext } from '../const';
import { actions, selectors } from '../redux';
import {
  formatPurchaseError,
  formatRestoreError,
  formatSubscribeMessage,
  formatTrialDuration,
} from '../services';

class SubscriptionsScreen extends PureComponent {
  constructor(props, contex) {
    super(props, contex);

    autoBindReact(this);

    this.state = {
      loading: false,
      successDescription:
        _.get(props.subscriptionProduct, 'subscriptionPeriodType') === 'trial'
          ? props.subscriptionMetadata.confirmationMessageTrial
          : props.subscriptionMetadata.confirmationMessageRegular,
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
      this.handleSubscriptionObtained();
    }
  }

  setLoadingState(loading) {
    this.setState({ loading });
  }

  handleSubscriptionObtained() {
    const { successDescription } = this.state;

    navigateTo(ext('SuccessScreen'), {
      onButtonPress: this.handleSuccessConfirmPress,
      description: successDescription,
    });
  }

  handlePreviewSubscribePress() {
    const { setMockedSubscriptionStatus } = this.props;

    setMockedSubscriptionStatus(true).then(this.handleSubscriptionObtained);
  }

  handleSuccessConfirmPress() {
    const { onSubscriptionObtained } = getRouteParams(this.props);

    onSubscriptionObtained();
  }

  handleBuyPress() {
    const { productId, buyProduct } = this.props;

    if (isPreviewApp) {
      this.handlePreviewSubscribePress();
      return;
    }

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

    if (isPreviewApp) {
      this.handlePreviewSubscribePress();
      return;
    }

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
    const { loading } = this.state;

    const trialDuration = formatTrialDuration(subscriptionProduct);

    return (
      <Screen styleName="paper with-notch-padding">
        <View styleName="flexible">
          <ScrollView contentContainerStyle={style.scrollContainer}>
            {!subscriptionMetadata.descriptionHtmlEnabled && (
              <>
                <Text style={style.leadingText}>
                  {subscriptionMetadata.subscriptionScreenDescription}
                </Text>
                <Image
                  resizeMode="contain"
                  source={{
                    uri: subscriptionMetadata.subscriptionScreenImageUrl,
                  }}
                  style={style.image}
                />
              </>
            )}
            {!!subscriptionMetadata.descriptionHtmlEnabled && (
              <SimpleHtml body={subscriptionMetadata.descriptionHtml} />
            )}
          </ScrollView>
          <LinearGradient
            pointerEvents="box-none"
            style={style.scrollGradient}
          />
        </View>
        <View style={style.buttonContainer}>
          <Button
            disabled={loading}
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
            disabled={loading}
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
      </Screen>
    );
  }
}

SubscriptionsScreen.propTypes = {
  buyProduct: PropTypes.func.isRequired,
  hasActiveProduct: PropTypes.bool.isRequired,
  navigation: PropTypes.object.isRequired,
  privacyPolicyUrl: PropTypes.string.isRequired,
  productId: PropTypes.string.isRequired,
  restorePurchases: PropTypes.func.isRequired,
  setMockedSubscriptionStatus: PropTypes.func.isRequired,
  subscriptionMetadata: PropTypes.object.isRequired,
  subscriptionProduct: PropTypes.object.isRequired,
  termsOfServiceUrl: PropTypes.string.isRequired,
  style: PropTypes.object,
};

SubscriptionsScreen.defaultProps = {
  style: {},
};

const mapStateToProps = (state, ownProps) => {
  const shortcutProductId = _.get(ownProps.route, ['params', 'productId']);
  const productId =
    shortcutProductId ?? selectors.getGlobalSubscriptionProductId(state);

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
  setMockedSubscriptionStatus: actions.setMockedSubscriptionStatus,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(connectStyle(ext('SubscriptionsScreen'))(SubscriptionsScreen));
