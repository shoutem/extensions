import Uri from 'urijs';

export default class ShoutemApi {
  constructor() {
    this.init = this.init.bind(this);
    this.buildUrl = this.buildUrl.bind(this);

    this.legacyHost = null;
  }

  init(legacyEndpoint) {
    this.legacyHost = new Uri(legacyEndpoint).host();
  }

  buildUrl(path = '', queryStringParams = '') {
    return new Uri(path)
      .protocol('https')
      .host(this.legacyHost)
      .query(`${queryStringParams}`)
      .toString();
  }
}
