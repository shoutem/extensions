/* global location */

import autoBind from 'auto-bind';
import _ from 'lodash';
import Uri from 'urijs';

export default class ShoutemUrls {
  constructor() {
    autoBind(this);

    this.appsHost = null;
  }

  init(page) {
    const apps = _.get(page, 'pageContext.url.apps');
    this.appsHost = new Uri(apps).host();
  }

  appsApi(path = '') {
    return new Uri(path)
      .protocol(location.protocol)
      .host(this.appsHost)
      .toString();
  }
}
