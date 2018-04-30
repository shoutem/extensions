import Uri from 'urijs';

export default class DealsApi {
  constructor() {
    this.init = this.init.bind(this);
    this.isInitialized = this.isInitialized.bind(this);
    this.buildUrl = this.buildUrl.bind(this);

    this.endpoint = null;
  }

  init(endpoint) {
    if (!endpoint) {
      throw new Error('Deals endpoint cannot be empty!');
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
