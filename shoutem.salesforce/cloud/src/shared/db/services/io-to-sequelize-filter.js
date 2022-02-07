import _ from 'lodash';

const ioSequelizeFilterMapping = {
  gt: '$gt',
  lt: '$lt',
  in: '$in',
};

export default function (ioFilter) {
  const sequelizeFilter = {};
  _.each(ioFilter, (filterValue, filter) => {
    if (_.isArray(filterValue)) {
      const sequelizeOperator = ioSequelizeFilterMapping.in;
      sequelizeFilter[filter] = { [`${sequelizeOperator}`]: filterValue };
    } else if (_.isObject(filterValue)) {
      _.each(filterValue, (value, operator) => {
        const sequelizeOperator = ioSequelizeFilterMapping[operator];
        if (sequelizeOperator) {
          sequelizeFilter[filter] = { [`${sequelizeOperator}`]: value };
        }
      });
    } else {
      sequelizeFilter[filter] = filterValue;
    }
  });
  return sequelizeFilter;
}
