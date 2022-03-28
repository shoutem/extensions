import autoBindReact from 'auto-bind/react';
import Uri from 'urijs';

class ShoutemApi {
  constructor() {
    autoBindReact(this);

    this.legacyHost = null;
    this.authHost = null;
    this.cloudHost = null;
    this.appsHost = null;
    this.appId = null;
  }

  init(legacyEndpoint, authApiEndpoint, cloudHost, appsHost, appId) {
    this.legacyHost = new Uri(legacyEndpoint).host();
    this.authHost = authApiEndpoint;
    this.appId = appId;
    this.cloudHost = cloudHost;
    this.appsHost = appsHost;
  }

  buildUrl(path = '', queryStringParams = '') {
    return new Uri(path)
      .protocol('https')
      .host(this.legacyHost)
      .query(`${queryStringParams}`)
      .toString();
  }

  buildCloudUrl(path = '', queryStringParams = '') {
    const endpoint = `${this.cloudHost}${path}`;

    return new Uri(endpoint).query(`${queryStringParams}`).toString();
  }

  buildAuthUrl(path = '', queryStringParams = '') {
    return new Uri(`/v1/realms/externalReference:${this.appId}/${path}`)
      .protocol('https')
      .host(this.authHost)
      .query(`${queryStringParams}`)
      .toString();
  }

  buildAppsUrl(path = '', queryStringParams = '') {
    const endpoint = `${this.appsHost}${path}`;

    return new Uri(endpoint).query(`${queryStringParams}`).toString();
  }
}

export const shoutemApi = new ShoutemApi();
