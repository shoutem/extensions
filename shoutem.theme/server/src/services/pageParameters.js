import autoBind from 'auto-bind';
import _ from 'lodash';

export default class PageParameters {
  constructor() {
    autoBind(this);

    this.parameters = null;
  }

  init(page) {
    this.parameters = _.get(page, 'parameters');
  }

  getExtensionTheme() {
    return _.get(this.parameters, 'extensionTheme');
  }
}
