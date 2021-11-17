import _ from 'lodash';
import autoBind from 'auto-bind';

class Types {
  constructor() {
    autoBind(this);

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

const types = new Types();

export default types;
