import Uri from 'urijs';

const settings = {
  authHost: undefined,
  appId: undefined,
};

function buildAuthUrl(path = '', queryStringParams = '') {
  return new Uri(`/v1/realms/externalReference:${settings.appId}/${path}`)
    .protocol('https')
    .host(settings.authHost)
    .query(`${queryStringParams}`)
    .toString();
}

function init(authApiEndpoint, appId) {
  settings.authHost = authApiEndpoint;
  settings.appId = appId;
}

export default { buildAuthUrl, init };
