import _ from 'lodash';
import { createSelector } from 'reselect';
import { getExtensionSettings } from 'shoutem.application';
import { ext } from '../const';

export const getShopifyState = state => state[ext()];

export const getShopState = createSelector(
  [getShopifyState],
  state => state.shop,
);

export const getCurrencyFormatting = createSelector(
  [getShopState],
  state => state.moneyFormat,
);

export const getOrdersState = createSelector(
  [getShopifyState],
  state => state.orders,
);

export const getOrdersLoading = createSelector(
  [getOrdersState],
  state => state.loading,
);

export const getOrders = createSelector([getOrdersState], state =>
  _.reverse(_.sortBy(_.values(state.orders), ['orderNumber'])),
);

export const getOrderById = createSelector(
  [getOrdersState, (_state, id) => id],
  (state, id) => state.orders[id],
);

export const getOrdersPageInfo = createSelector(
  [getOrdersState],
  state => state.pageInfo,
);

export const getOrdersError = createSelector([getOrdersState], state => ({
  error: state.error,
  errorMessage: state.errorMessage,
}));

export const getCartState = createSelector(
  [getShopifyState],
  state => state.cart,
);

export const getCustomerState = createSelector(
  [getShopifyState],
  state => state.customer,
);

export const getCustomer = createSelector(
  [getCustomerState],
  state => state.customer,
);

export const isLoggedIn = createSelector(
  [getCustomerState],
  state => state.isLoggedIn,
);

export const getCheckoutCustomerInfo = createSelector([getCustomer], state => {
  const customerFields = _.pick(state, ['email']);
  const addressFields = _.pick(state.defaultAddress, [
    'firstName',
    'lastName',
    'address1',
    'city',
    'country',
    'phone',
    'zip',
    'province',
  ]);

  return {
    ...customerFields,
    ...addressFields,
    countryCode: state.defaultAddress?.countryCodeV2,
    countryName: state.defaultAddress?.country,
  };
});

export const getCustomerAddresses = createSelector([getCustomer], state => {
  if (_.isEmpty(state.defaultAddress)) {
    return {
      defaultAddress: [],
      addresses: [],
    };
  }
  const resolvedAddresses = _.filter(
    state.addresses,
    address => address.id !== state.defaultAddress.id,
  );

  return {
    defaultAddress: [state.defaultAddress],
    addresses: resolvedAddresses,
  };
});

export const getCustomerAddressById = createSelector(
  [getCustomer, (_state, addressId) => addressId],
  (state, addressId) => {
    if (_.isEmpty(state.addresses)) {
      return {};
    }

    return _.find(state.addresses, { id: addressId });
  },
);

export const getCustomerError = createSelector(
  [getCustomerState],
  state => state.error,
);

export const getCustomerLoading = createSelector(
  [getCustomerState],
  state => state.loading,
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

    if (_.isEmpty(collections)) {
      return [];
    }

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
