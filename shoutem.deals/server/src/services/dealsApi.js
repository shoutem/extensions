import i18next from 'i18next';
import Uri from 'urijs';
import LOCALIZATION from './localization';

let endpoint = null;

function buildUrl(path = '') {
  return new Uri(path)
    .protocol(location.protocol)
    .host(endpoint)
    .toString();
}

function init(newEndpoint) {
  if (!newEndpoint) {
    throw new Error(i18next.t(LOCALIZATION.EMPTY_DEALS_ENDPOINT_TITLE));
  }

  endpoint = new Uri(newEndpoint).host();
}

function isInitialized() {
  return !!endpoint;
}

export default {
  buildUrl,
  init,
  isInitialized,
};
