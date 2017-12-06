import _ from 'lodash';
import Uri from 'urijs';

export default class ShoutemUrls {
  constructor() {
    this.init = this.init.bind(this);

    this.buildLegacyUrl = this.buildLegacyUrl.bind(this);

    this.legacyHost = null;
  }

  init(page) {
    const url = _.get(page, 'pageContext.url', {});

    const { legacy } = url;

    this.legacyHost = new Uri(legacy).host();
  }

  buildLegacyUrl(path = '') {
    return new Uri(path)
      .protocol(location.protocol)
      .host(this.legacyHost)
      .toString();
  }
}
