import _ from 'lodash';
import { getExtensionSettings } from 'shoutem.application/redux';
import { isPreviewApp } from 'shoutem.preview';
import { isIos } from 'shoutem-core';
import { ext } from '../const';

function getModuleState(state) {
  return state[ext()];
}

export function getMockedSubscriptionStatus(state) {
  return getModuleState(state).mockedSubscription;
}

export function getAvailableProducts(state) {
  return getModuleState(state).availableProducts;
}

export function getActiveProducts(state) {
  return getModuleState(state).activeProducts;
}

export function hasActiveProduct(productId, state) {
  const activeProducts = getActiveProducts(state);

  return !!_.find(activeProducts, product => 
    product.sku === productId || product?.groupName === productId
  );
}

export function getGlobalSubscriptionProductId(state) {
  const extensionSettings = getExtensionSettings(state, ext());

  return isIos
    ? _.get(extensionSettings, 'iOSProductId')
    : _.get(extensionSettings, 'androidProductId');
}

export function isSubscribed(productId, state) {
  const requiredProductId = productId ?? getGlobalSubscriptionProductId(state);

  return (
    hasActiveProduct(requiredProductId, state) ||
    (isPreviewApp && getMockedSubscriptionStatus(state) === true)
  );
}

export function isSubscriptionRequired(state) {
  const extensionSettings = getExtensionSettings(state, ext());

  return _.get(extensionSettings, 'subscriptionRequired');
}

export function getAvailableProduct(productId, state) {
  return _.filter(getAvailableProducts(state), product => 
    product.sku === productId || product?.groupName === productId
  );
}

export function getPrivacyPolicyLink(state) {
  const extensionSettings = getExtensionSettings(state, ext());

  return _.get(extensionSettings, 'privacyPolicyUrl');
}

export function getTermsOfServiceLink(state) {
  const extensionSettings = getExtensionSettings(state, ext());

  return _.get(extensionSettings, 'termsOfServiceUrl');
}

export function getSubscriptionMetadata(state) {
  const extensionSettings = getExtensionSettings(state, ext());

  const {
    subscriptionScreenTitle,
    subscriptionScreenDescription,
    subscriptionScreenImageUrl,
    confirmationMessageTrial,
    confirmationMessageRegular,
    descriptionHtml,
    descriptionHtmlEnabled,
  } = extensionSettings;

  return {
    subscriptionScreenTitle,
    subscriptionScreenDescription,
    subscriptionScreenImageUrl,
    confirmationMessageTrial,
    confirmationMessageRegular,
    descriptionHtml,
    descriptionHtmlEnabled,
  };
}

export function hasProperGlobalConfiguration(state) {
  const extensionSettings = getExtensionSettings(state, ext());
  const productId = getGlobalSubscriptionProductId(state);

  const { iapHubApiKey, iapHubAppId } = extensionSettings;

  return (
    !_.isEmpty(iapHubApiKey) && !_.isEmpty(iapHubAppId) && !_.isEmpty(productId)
  );
}

export default {
  getAvailableProducts,
  getActiveProducts,
  hasActiveProduct,
  getGlobalSubscriptionProductId,
  isSubscriptionRequired,
  getAvailableProduct,
  getPrivacyPolicyLink,
  getTermsOfServiceLink,
  isSubscribed,
  getSubscriptionMetadata,
  hasProperGlobalConfiguration,
};
