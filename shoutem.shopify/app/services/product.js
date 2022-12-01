import _ from 'lodash';
import { images } from '../assets';

export function getCurrentItem(item) {
  // TODO: featured item is received as array, bug with @shoutem/ui
  return Array.isArray(item) ? item[0] : item;
}

export function getProductPrices(product) {
  const { price, compareAtPrice: oldPrice } = product.variants[0];

  return { price, oldPrice };
}

export function getProductImage(productImages) {
  if (!_.isEmpty(productImages) && productImages[0].url) {
    return { uri: productImages[0].url };
  }

  return images.fallback;
}

/**
 * Gets values available for selection based on available
 * variants and option. For example, if we only have
 * Small merino wool sweaters, we won't show Medium or
 * Large when the user has selected merino wool.
 */

export const getAvailableValuesForOption = (availableVariants, option) => {
  const availableValues = [];

  _.forEach(availableVariants, variant => {
    _.forEach(variant.selectedOptions, variantOption => {
      if (option.name === variantOption.name) {
        availableValues.push(variantOption);
      }
    });
  });

  return _.uniqBy(availableValues, 'value');
};

/**
 * Returns first available variant for a product or the
 * first variant if none are available.
 */
export const getFirstAvailableVariant = item =>
  _.find(item.variants, 'availableForSale') || item.variants[0];

/**
 * Gets values uniquely identifying a variant, for example a
 * Navy wool sweater. Each variant has a list of options that
 * uniquely defines it. For a Navy wool sweater, these
 * options are of the form:
 * [{name: 'color', value: 'Navy'}, {name: 'material', value: 'wool'}}]
 */
export const getValuesForVariant = variant => {
  return _.reduce(
    variant.selectedOptions,
    (result, option) => {
      return _.merge({}, result, { [option.name]: option.value });
    },
    {},
  );
};

/**
 * Produces list of product option values that are available
 * for sale
 */
export const getSellableProductOptions = item => {
  return _.reduce(
    item.options,
    (result, option) => {
      const optionValues = getAvailableValuesForOption(item.variants, option);

      if (_.isEmpty(optionValues)) {
        return result;
      }

      return {
        ...result,
        [option.name]: {
          name: option.name,
          values: _.map(optionValues, option => option.value),
        },
      };
    },
    {},
  );
};
