import Uri from 'urijs';

let shoutemApi = { loyaltyHost: null };

function init(loyaltyEndpoint) {
  shoutemApi = {
    loyaltyHost: new Uri(loyaltyEndpoint).host(),
  };
}

function buildLoyaltyUrl(path = '') {
  return new Uri(path)
    .protocol('https')
    .host(shoutemApi.loyaltyHost)
    .toString();
}

export default {
  init,
  buildLoyaltyUrl,
};
