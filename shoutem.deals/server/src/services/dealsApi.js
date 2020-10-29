import Uri from 'urijs';
import i18next from 'i18next';
import LOCALIZATION from './localization';

export default class DealsApi {
  constructor() {
    this.init = this.init.bind(this);
    this.isInitialized = this.isInitialized.bind(this);
    this.buildUrl = this.buildUrl.bind(this);

    this.endpoint = null;
  }

  init(endpoint) {
    if (!endpoint) {
      throw new Error(i18next.t(LOCALIZATION.EMPTY_DEALS_ENDPOINT_TITLE));
    }

    this.endpoint = endpoint;
  }

  isInitialized() {
    return !!this.endpoint;
  }

  buildUrl(path = '') {
    return new Uri(path)
      .protocol(location.protocol)
      .host(this.endpoint)
      .toString();
  }
}
