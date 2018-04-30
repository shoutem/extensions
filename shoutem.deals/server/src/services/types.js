import _ from 'lodash';

export default class Types {
  constructor() {
    this.init = this.init.bind(this);

    this.CATALOGS = 'shoutem.deal.catalogs';
    this.TRANSACTIONS = 'shoutem.deal.transactions';
    this.USERS = 'shoutem.core.users';
    this.PLACES = null;
    this.DEALS = null;
  }

  init(page) {
    this.PLACES = _.get(page, 'parameters.placesSchema');
    this.DEALS = _.get(page, 'parameters.schema');
  }
}
