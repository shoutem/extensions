import BaseTypes from 'sequelize';
import util from 'util';

// documentation: https://github.com/sequelize/sequelize/issues/3989
export function TIMESTAMP(...args) {
  if (!(this instanceof TIMESTAMP)) {
    return new TIMESTAMP();
  }

  BaseTypes.ABSTRACT.apply(this, args);
}

util.inherits(TIMESTAMP, BaseTypes.ABSTRACT);
TIMESTAMP.prototype.key = 'TIMESTAMP';
TIMESTAMP.key = 'TIMESTAMP';
