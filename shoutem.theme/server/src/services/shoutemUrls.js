import autoBind from 'auto-bind';
import _ from 'lodash';
import Uri from 'urijs';

export default class ShoutemUrls {
  constructor() {
    autoBind(this);

    this.extensionsHost = null;
    this.appsHost = null;
    this.authToken = null;
  }

  init(page) {
    const extensions = _.get(page, 'pageContext.url.extensions');
    const apps = _.get(page, 'pageContext.url.apps');
    const authToken = _.get(page, 'pageContext.auth.token');

    this.extensionsHost = new Uri(extensions).host();
    this.appsHost = new Uri(apps).host();
    this.authToken = authToken;
  }

  extensionApi(path = '') {
    return new Uri(path)
      .protocol(location.protocol)
      .host(this.extensionsHost)
      .toString();
  }

  appsApi(path = '') {
    return new Uri(path)
      .protocol(location.protocol)
      .host(this.appsHost)
      .toString();
  }

  getToken() {
    return this.authToken;
  }
}
