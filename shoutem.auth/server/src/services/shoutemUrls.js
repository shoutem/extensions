import _ from 'lodash';
import Uri from 'urijs';
import autoBind from 'auto-bind';

export default class ShoutemUrls {
  constructor() {
    autoBind(this);

    this.legacyHost = null;
    this.authHost = null;
  }

  init(page) {
    const url = _.get(page, 'pageContext.url', {});

    const { legacy, auth } = url;

    this.legacyHost = new Uri(legacy).host();
    this.authHost = new Uri(auth).host();
  }

  buildLegacyUrl(path = '') {
    return new Uri(path)
      .protocol(location.protocol)
      .host(this.legacyHost)
      .toString();
  }

  buildAuthUrl(path = '') {
    return new Uri(path)
      .protocol(location.protocol)
      .host(this.authHost)
      .toString();
  }
}
