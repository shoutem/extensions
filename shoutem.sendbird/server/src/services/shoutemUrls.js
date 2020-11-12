import _ from 'lodash';
import Uri from 'urijs';
import autoBind from 'auto-bind';

export default class ShoutemUrls {
  constructor() {
    autoBind(this);

    this.appsHost = null;
  }

  init(page) {
    const url = _.get(page, 'pageContext.url', {});

    const { apps } = url;
    const billing = _.replace(apps, 'apps', 'billing');

    this.appsHost = new Uri(apps).host();
    this.billingHost = new Uri(billing).host();
  }

  appsApi(path = '') {
    return new Uri(path)
      .protocol(location.protocol)
      .host(this.appsHost)
      .toString();
  }

  billingApi(path = '') {
    return new Uri(path)
      .protocol(location.protocol)
      .host(this.billingHost)
      .toString();
  }
}
