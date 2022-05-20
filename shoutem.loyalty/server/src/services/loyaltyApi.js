import autoBind from 'auto-bind';
import i18next from 'i18next';
import Uri from 'urijs';
import LOCALIZATION from './localization';

export default class LoyaltyApi {
  constructor() {
    autoBind(this);

    this.endpoint = null;
  }

  init(endpoint) {
    if (!endpoint) {
      throw new Error(i18next.t(LOCALIZATION.LOYALTY_ENDPOINT_MISSING));
    }

    this.endpoint = new Uri(endpoint).host();
  }

  isInitialized() {
    return !!this.endpoint;
  }

  getUrl(path = '') {
    return new Uri(path)
      .protocol(location.protocol)
      .host(this.endpoint)
      .toString();
  }
}
