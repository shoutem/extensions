import _ from 'lodash';
import { createSelector } from 'reselect';
import { getExtensionSettings } from 'shoutem.application';
import { ext } from '../const';

export const getShopifyState = state => state[ext()];

export const getShopState = createSelector(
  [getShopifyState],
  state => state.shop,
);

export const getCartState = createSelector(
  [getShopifyState],
  state => state.cart,
);

export const getCartSize = createSelector([getCartState], cart =>
  _.reduce(cart, (result, item) => result + item.quantity, 0),
);

export const getCartTotal = createSelector([getCartState], cart => {
  const total = cart.reduce(
    (total, { quantity, variant }) =>
      total + quantity * parseFloat(variant.price),
    0,
  );

  return total.toFixed(2);
});

export const getDiscountCode = createSelector(
  [state => getExtensionSettings(state, ext())],
  settings => _.get(settings, 'discountCode'),
);

export const getCollectionsVisibleInShortcut = createSelector(
  [getShopState, (_state, selectedCollections) => selectedCollections],
  ({ collections }, selectedCollections) => {
    const getId = k => parseFloat(k.split('/')[4]);

    const resultCollections = _.filter(
      collections,
      collection =>
        !_.size(selectedCollections) ||
        _.includes(selectedCollections, getId(collection.id)),
    );

    if (_.isEmpty(resultCollections)) {
      return [collections[0]];
    }

    return resultCollections;
  },
);

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
export const getProducts = createSelector(
  [
    getShopifyState,
    (_state, collectionId = 0) => collectionId,
    (_state, _collectionId, tag = undefined) => tag,
  ],
  (state, collectionId, tag) => {
    const { products, collections, tags } = state;
    const productState =
      (tags[tag] ? tags[tag] : collections[collectionId]) || {};

    return {
      ...productState,
      products: _.map(productState.productIds, id => products[id]),
    };
  },
);

export function getShopifyGooglePlacesApiKey(state) {
  const settings = getExtensionSettings(state, ext());

  return _.get(settings, 'services.self.apiKeys.googlePlacesApiKey');
}
