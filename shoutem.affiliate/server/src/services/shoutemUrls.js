import Uri from 'urijs';

let shoutemApi = {};

function init({ authEndpoint, cmsEndpoint, loyaltyEndpoint }) {
  shoutemApi = {
    authHost: new Uri(authEndpoint).host(),
    cmsHost: new Uri(cmsEndpoint).host(),
    loyaltyHost: new Uri(loyaltyEndpoint).host(),
  };
}

function buildAuthUrl(path = '') {
  return new Uri(path)
    .protocol('https')
    .host(shoutemApi.authHost)
    .toString();
}

function buildCmsUrl(path = '') {
  return new Uri(path)
    .protocol('https')
    .host(shoutemApi.cmsHost)
    .toString();
}

function buildLoyaltyUrl(path = '') {
  return new Uri(path)
    .protocol('https')
    .host(shoutemApi.loyaltyHost)
    .toString();
}

export default {
  init,
  buildAuthUrl,
  buildCmsUrl,
  buildLoyaltyUrl,
};
