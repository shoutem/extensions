import _ from 'lodash';

export function createOptions(items, valueProp = 'id', labelProp = 'name') {
  if (_.isEmpty(items)) {
    return [];
  }

  return _.reduce(items, (result, item) => {
    const value = _.get(item, valueProp);
    const label = _.get(item, labelProp);

    if (value && label) {
      result.push({ value, label });
    }

    return result;
  }, []);
}
