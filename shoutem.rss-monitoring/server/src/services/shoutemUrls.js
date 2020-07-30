import _ from 'lodash';
import Uri from 'urijs';
import autoBind from 'auto-bind';

export default class ShoutemUrls {
  constructor() {
    autoBind(this);

    this.authHost = null;
  }

  init(page) {
    const url = _.get(page, 'pageContext.url', {});

    const { apps } = url;
    this.appsHost = new Uri(apps).host();
  }

  appsApi(path = '') {
    return new Uri(path)
      .protocol(location.protocol)
      .host(this.appsHost)
      .toString();
  }
}
