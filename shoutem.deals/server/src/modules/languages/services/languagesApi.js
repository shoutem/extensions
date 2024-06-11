import Uri from 'urijs';

let endpoint = null;

function buildUrl(path = '') {
  return new Uri(path)
    .protocol(location.protocol)
    .host(endpoint)
    .toString();
}

function init(newEndpoint) {
  if (!newEndpoint) {
    return;
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
