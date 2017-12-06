import _ from 'lodash';
import Uri from 'urijs';

export default class ShoutemUrls {
  constructor() {
    this.init = this.init.bind(this);

    this.getAppsUrl = this.getAppsUrl.bind(this);

    this.apps = null;
  }

  init(page) {
    const url = _.get(page, 'pageContext.url', {});
    const { apps } = url;
    this.apps = apps;
  }

  getAppsUrl(path = '') {
    return this.apps + path;
  }
}
