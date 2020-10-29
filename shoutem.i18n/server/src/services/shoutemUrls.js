import _ from 'lodash';
import Uri from 'urijs';
import autoBind from 'auto-bind';

export default class ShoutemUrls {
  constructor() {
    autoBind(this);

    this.legacyHost = null;
    this.appsHost = null;
  }

  init(page) {
    const url = _.get(page, 'pageContext.url', {});

    const { legacy, apps } = url;

    this.legacyHost = new Uri(legacy).host();
    this.appsHost = new Uri(apps).host();
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
}
