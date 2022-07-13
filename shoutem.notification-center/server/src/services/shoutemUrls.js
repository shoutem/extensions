import autoBind from 'auto-bind';
import _ from 'lodash';
import Uri from 'urijs';

export default class ShoutemUrls {
  constructor() {
    autoBind(this);

    this.legacyHost = null;
    this.authHost = null;
  }

  init(page) {
    const url = _.get(page, 'pageContext.url', {});

    const { legacy, apps, extensions } = url;

    this.legacyHost = new Uri(legacy).host();
    this.appsHost = new Uri(apps).host();
    this.extensionsHost = new Uri(extensions).host();
  }

  legacyApi(path = '') {
    return new Uri(path)
      .protocol(location.protocol)
      .host(this.legacyHost)
      .toString();
  }

  appsApi(path = '') {
    return new Uri(path)
      .protocol(location.protocol)
      .host(this.appsHost)
      .toString();
  }

  extensionsApi(path = '') {
    return new Uri(path)
      .protocol(location.protocol)
      .host(this.extensionsHost)
      .toString();
  }
}
