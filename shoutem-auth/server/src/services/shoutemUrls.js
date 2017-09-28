import _ from 'lodash';
import Uri from 'urijs';

export default class ShoutemUrls {
  constructor() {
    this.init = this.init.bind(this);

    this.buildLegacyUrl = this.buildLegacyUrl.bind(this);
    this.buildHomepageUrl = this.buildHomepageUrl.bind(this);

    this.legacyHost = null;
    this.homepageHost = null;
  }

  init(page) {
    const url = _.get(page, 'pageContext.url', {});

    const { legacy, homepage } = url;

    this.legacyHost = new Uri(legacy).host();
    this.homepageHost = new Uri(homepage).host();
  }

  buildLegacyUrl(path = '') {
    return new Uri(path)
      .protocol(location.protocol)
      .host(this.legacyHost)
      .toString();
  }

  buildHomepageUrl(path = '', query = {}) {
    return new Uri(this.homepageHost)
    .protocol(location.protocol)
      .path(path)
      .query(query)
      .toString();
  }
}
