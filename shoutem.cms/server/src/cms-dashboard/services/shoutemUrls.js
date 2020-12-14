import _ from 'lodash';
import Uri from 'urijs';

export default class ShoutemUrls {
  constructor() {
    this.init = this.init.bind(this);

    this.buildLegacyUrl = this.buildLegacyUrl.bind(this);

    this.legacyHost = null;
  }

  init(url) {
    const legacy = _.get(url, 'legacy');
    this.legacyHost = legacy;
  }

  buildLegacyUrl(path = '') {
    return new Uri(path)
      .protocol(location.protocol)
      .host(this.legacyHost)
      .toString();
  }
}
