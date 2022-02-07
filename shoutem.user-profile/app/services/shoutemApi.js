import Uri from 'urijs';

let shoutemApi = { appId: null, appsHost: null, legacyHost: null };

function init(appId, appsEndpoint, legacyEndpoint) {
  shoutemApi = {
    appId,
    appsHost: new Uri(appsEndpoint).host(),
    legacyHost: new Uri(legacyEndpoint).host(),
  };
}

function buildUrl(path = '') {
  return new Uri(path)
    .protocol('https')
    .host(shoutemApi.appsHost)
    .toString();
}

function buildLegacyUrl(path = '', queryStringParams = '') {
  return new Uri(`/v1/apps/${shoutemApi.appId}/${path}`)
    .protocol('https')
    .host(shoutemApi.legacyHost)
    .query(`${queryStringParams}`)
    .toString();
}

export default {
  init,
  buildUrl,
  buildLegacyUrl,
};
