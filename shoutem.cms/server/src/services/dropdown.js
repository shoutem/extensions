import _ from 'lodash';
import i18next from 'i18next';
import LOCALIZATION from './localization';
import { getArrayDisplayLabel } from './array';

export function getDropdownOptions(
  resources,
  keyProp = 'id',
  labelProp = 'name',
) {
  return _.reduce(
    resources,
    (result, resource) => {
      const key = _.get(resource, keyProp);
      const label = _.get(resource, labelProp);

      if (!key || !label) {
        return result;
      }

      return {
        ...result,
        [key]: { key, label },
      };
    },
    {},
  );
}

export function getSelectedOptionLabel(
  options,
  selectedData,
  noDataLabel = i18next.t(LOCALIZATION.SELECT_DATA),
) {
  if (_.isEmpty(options)) {
    return noDataLabel;
  }

  if (!selectedData || _.isEmpty(selectedData)) {
    return noDataLabel;
  }

  if (!_.isArray(selectedData)) {
    return _.get(options, [selectedData, 'label'], noDataLabel);
  }

  const selectedOptions = _.filter(options, option =>
    _.includes(selectedData, option.key),
  );

  const selectedCategoryNames = _.map(selectedOptions, 'label');
  return getArrayDisplayLabel(selectedCategoryNames);
}
