import _ from 'lodash';
import Uri from 'urijs';
import autoBind from 'auto-bind';

export default class ShoutemUrls {
  constructor() {
    autoBind(this);

    this.legacyHost = null;
  }

  init(page) {
    const url = _.get(page, 'pageContext.url.legacy');
    const legacyUrl = new Uri(url);

    this.legacyHost = legacyUrl.hostname();
  }

  buildLegacyUrl(path = '') {
    return new Uri(path)
      .protocol(location.protocol)
      .host(this.legacyHost)
      .toString();
  }
}
