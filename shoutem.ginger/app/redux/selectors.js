import _ from 'lodash';
import moment from 'moment';
import { createSelector } from 'reselect';
import { getExtensionSettings } from 'shoutem.application';
import { getUser } from 'shoutem.auth';
import { ALL_CATEGORY, ext, ORDER_STATUSES } from '../const';
import { getCollectionData, isBonusCartItem, isLoading } from '../services';

// Extension substate getter
function getExtensionState(state) {
  return state[ext()];
}

// Reducer getters
export function getInventory(state) {
  return getCollectionData(getExtensionState(state).inventory);
}

export function getCart(state) {
  return getCollectionData(getExtensionState(state).cart);
}

export function getDeliveryTimes(state) {
  return getCollectionData(getExtensionState(state).deliveryTimes);
}

export function getOrders(state) {
  return getCollectionData(getExtensionState(state).orders);
}

export const getCustomerProfile = createSelector(
  [getExtensionState],
  state => state.customerProfile,
);

export const getAgeVerificationCompleted = createSelector(
  [getExtensionState],
  state => state.ageVerification.completed,
);

export const getInitialLoginScreenShown = createSelector(
  [getExtensionState],
  state => state.initialLoginScreen.shown,
);

// Reducer state derivation selectors - CART
export const isCartLoading = createSelector(
  [state => getExtensionState(state).cart],
  cart => isLoading(cart),
);

export const getCartProducts = createSelector([getCart], cart =>
  _.get(cart, 'skus', []),
);

export const getActiveDiscount = createSelector([getCart], cart =>
  _.get(cart, 'vouchers[0]'),
);

export const getCompactCartProducts = createSelector(
  [getCartProducts],
  products =>
    _.compact(
      _.map(products, product => {
        if (!isBonusCartItem(product)) {
          return {
            skuId: product.skuId,
            quantity: product.quantity,
          };
        }

        return undefined;
      }),
    ),
);

export const getCartListItems = createSelector(
  [state => getCategoryItems(state, ALL_CATEGORY.id), getCartProducts],
  (inventory, cart) =>
    _.reduce(
      cart,
      (result, cartItem) => {
        const inventoryItem = _.find(inventory, { skuId: cartItem.skuId });

        return [...result, { ...cartItem, product: inventoryItem }];
      },
      [],
    ),
);

export const getCartItemQuantity = createSelector(
  [state => getCategoryItems(state, ALL_CATEGORY.id), (_state, skuId) => skuId],
  (inventory, skuId) => {
    const item = _.find(inventory, { skuId });

    return item.quantity;
  },
);

// Reducer state derivation selectors - INVENTORY
export const isInventoryLoading = createSelector(
  [state => getExtensionState(state).inventory],
  inventory => isLoading(inventory),
);

export const getCategories = createSelector([getInventory], inventory => [
  ALL_CATEGORY,
  ..._.map(inventory, category => ({
    name: category.categoryName,
    id: category.categoryId,
    description: category.categoryDescription,
  })),
]);

export const getCategoryItems = createSelector(
  [getInventory, (_state, categoryId) => categoryId],
  (inventory, categoryId) => {
    if (categoryId === ALL_CATEGORY.id) {
      return _.reduce(
        inventory,
        (result, category) => {
          return [...result, ...category.skus];
        },
        [],
      );
    }

    const category = _.find(inventory, { categoryId });

    return category?.skus;
  },
);

// Reducer state derivation selectors - ORDERS
export const areOrdersLoading = createSelector(
  [state => getExtensionState(state).orders],
  orders => isLoading(orders),
);

export const getOrder = createSelector(
  [getOrders, (_state, orderId) => orderId],
  (orders, orderId) => _.find(orders, { id: orderId }),
);

export const getOrderImages = createSelector(
  [getOrder, state => getCategoryItems(state, ALL_CATEGORY.id)],
  (order, items) => {
    const itemIds = _.map(order.skus, sku => sku.skuId);

    return _.reduce(
      itemIds,
      (result, skuId) => {
        const matchingItem = _.find(items, { skuId });

        if (matchingItem) {
          result.push(_.head(matchingItem.images));
          return result;
        }

        return result;
      },
      [],
    );
  },
);

export const getOrdersMonthlySections = createSelector([getOrders], orders => {
  const pastMonth = moment()
    .subtract(1, 'months')
    .month();
  const lists = _.reduce(
    orders,
    (result, order) => {
      if (order.status === ORDER_STATUSES.DRAFT) {
        return result;
      }

      if (moment().isSameOrBefore(moment(order.timeslot.date), 'month')) {
        return {
          ...result,
          thisMonth: [...result.thisMonth, order],
        };
      }

      if (moment(order.timeslot.date).month() === pastMonth) {
        return {
          ...result,
          lastMonth: [...result.lastMonth, order],
        };
      }

      return {
        ...result,
        older: [...result.older, order],
      };
    },
    { thisMonth: [], lastMonth: [], older: [] },
  );

  return [
    { data: lists.thisMonth, key: 'thisMonth' },
    { data: lists.lastMonth, key: 'pastMonth' },
    { data: lists.older, key: 'older' },
  ];
});

// Reducer state derivation selectors - DELIVERY TIMES
export const getDeliveryOptions = createSelector(
  [getDeliveryTimes],
  deliveryTimes => {
    const deliveryDates = _.map(deliveryTimes, timeslot => timeslot.date);
    const deliveryTimeslots = _.reduce(
      deliveryTimes,
      (result, timeslot) => {
        return {
          ...result,
          [timeslot.date]: timeslot.intervals,
        };
      },
      {},
    );

    return { deliveryDates, deliveryTimeslots };
  },
);

// Ginger customer info getters ( saved in shoutem.user-profile )
export const getCustomerPlaceId = createSelector(
  [getGingerCustomer, (_state, addressIndex) => addressIndex],
  (customer, addressIndex) => {
    if (_.isEmpty(customer)) {
      return '';
    }

    const resolvedIndex = addressIndex || customer.defaultAddress;
    return customer.addresses[resolvedIndex].googlePlaceId;
  },
);

export const getCustomerAddress = createSelector(
  [getGingerCustomer, (_state, addressIndex) => addressIndex],
  (customer, addressIndex) => {
    const resolvedIndex = addressIndex || customer.defaultAddress;
    return customer.addresses[resolvedIndex].address;
  },
);

export function getGingerCustomer(state) {
  const user = getUser(state);

  return { ..._.get(user, ['profile', ext()]) };
}

export function getGingerProfile(state) {
  const user = getUser(state);
  const userProfile = _.omit(_.get(user, 'profile'), ext());
  const gingerProfile = _.get(user, ['profile', ext()]);

  return { ...userProfile, ...gingerProfile };
}

// Extension settings

export function getGingerGooglePlacesApiKey(state) {
  const settings = getExtensionSettings(state, ext());

  return _.get(settings, 'services.self.apiKeys.googlePlacesApiKey');
}

export function getRetailersList(state) {
  const settings = getExtensionSettings(state, ext());

  return _.get(settings, 'retailerList');
}
