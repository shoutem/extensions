import autoBind from 'auto-bind';
import _ from 'lodash';
import Uri from 'urijs';

export default class ShoutemUrls {
  constructor() {
    autoBind(this);

    this.authHost = null;
  }

  init(page) {
    const url = _.get(page, 'pageContext.url', {});

    const { auth } = url;

    this.authHost = new Uri(auth).host();
  }

  buildAuthUrl(path = '') {
    return new Uri(path)
      .protocol(location.protocol)
      .host(this.authHost)
      .toString();
  }
}
