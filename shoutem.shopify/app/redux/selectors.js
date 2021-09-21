import _ from 'lodash';
import { getExtensionSettings } from 'shoutem.application';

import { ext } from '../const';

export const getCartSize = state => {
  const { cart } = state[ext()];

  return _.reduce(cart, (result, item) => result + item.quantity, 0);
};

export const getCartTotal = state => {
  const { cart } = state[ext()];

  const total = cart.reduce(
    (total, { quantity, variant }) =>
      total + quantity * parseFloat(variant.price),
    0,
  );

  return total.toFixed(2);
};

export function getDiscountCode(state) {
  const settings = getExtensionSettings(state, ext());

  return _.get(settings, 'discountCode');
}

/**
 * Gets already fetched products for tag or collection, saved in local state.
 * Products are stored in two indexes, by tag and collection ID. The indexes
 * contain their loading and error status, page and IDs. This function
 * uses the IDs from an index to load products from a local dictionary.
 *
 * The 'All' collection is keyed by 0.
 *
 * @param tag - Tag used for filtering
 * @param collectionId - ID of the collection
 * @param state - Local state
 * @returns List of locally stored products and their status for tag or collection
 */
export const getProducts = (state, collectionId = 0, tag) => {
  const { products, collections, tags } = state[ext()];
  const productState = tag ? tags[tag] : collections[collectionId];

  return {
    ...productState,
    products: _.map((productState || {}).productIds, id => products[id]),
  };
};
