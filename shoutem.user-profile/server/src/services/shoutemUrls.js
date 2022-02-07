import Uri from 'urijs';

let shoutemApi = {};

function init({ authEndpoint }) {
  shoutemApi = {
    authHost: new Uri(authEndpoint).host(),
  };
}

function buildAuthUrl(path = '') {
  return new Uri(path)
    .protocol('https')
    .host(shoutemApi.authHost)
    .toString();
}

export default {
  init,
  buildAuthUrl,
};
