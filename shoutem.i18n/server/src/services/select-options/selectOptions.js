import _ from 'lodash';

export function createSelectOptions(options, generateLabel, keyProp = 'id') {
  return _.reduce(options, (result, option) => {
    const label = generateLabel(option);
    const value = _.get(option, keyProp);

    result.push({ value, label });
    return result;
  }, []);
}
