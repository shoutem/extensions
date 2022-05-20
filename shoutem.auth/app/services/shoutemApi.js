import autoBindReact from 'auto-bind/react';
import Uri from 'urijs';

export default class ShoutemApi {
  constructor() {
    autoBindReact(this);

    this.authHost = null;
    this.appId = null;
  }

  init(authApiEndpoint, appId) {
    this.authHost = new Uri(authApiEndpoint).host();
    this.appId = appId;
  }

  buildAuthUrl(path = '', queryStringParams = '') {
    return new Uri(`/v1/realms/externalReference:${this.appId}/${path}`)
      .protocol('https')
      .host(this.authHost)
      .query(`${queryStringParams}`)
      .toString();
  }
}

export const shoutemApi = new ShoutemApi();
