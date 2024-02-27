import autoBind from 'auto-bind';
import _ from 'lodash';
import Uri from 'urijs';

export default class ShoutemUrls {
  constructor() {
    autoBind(this);

    this.legacyHost = null;
    this.appsHost = null;
  }

  init(page) {
    const url = _.get(page, 'pageContext.url', {});

    const { legacy, cloud } = url;

    this.legacyHost = new Uri(legacy).host();
    this.cloudHost = new Uri(cloud).host();
  }

  legacyApi(path = '') {
    return new Uri(path)
      .protocol(location.protocol)
      .host(this.legacyHost)
      .toString();
  }

  cloudApi(path = '') {
    return new Uri(path)
      .protocol(location.protocol)
      .host(this.cloudHost)
      .toString();
  }
}
