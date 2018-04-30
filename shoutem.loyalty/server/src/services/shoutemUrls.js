import _ from 'lodash';
import Uri from 'urijs';

export default class ShoutemUrls {
  constructor() {
    this.init = this.init.bind(this);

    this.buildAuthUrl = this.buildAuthUrl.bind(this);

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
