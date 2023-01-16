import { NativeModules, Platform } from 'react-native';
import _ from 'lodash';

const { MBBridge } = NativeModules;

/*
 * We use this function to clean the information coming from the native side
 * this only affects to Android which send so much garbage that we don't need
 */
const cleanUp = Platform.select({
  ios: a => a,
  android: (obj, parse = false) => {
    // 1st level come as a JSON string, we assume we
    // need to parse it to a JSON pbject

    if (parse) {
      obj = JSON.parse(obj);
      if (obj.responseData) obj = obj.responseData;
    }

    /*
     * For each key let's see if is an object, if it's a valid object for lodash
     * if it has a responseData and justreturn it, otherwise the ID's from
     * android is an object containing ID so we just need to pass that value and
     * then just do a clean up and reassign the key with the cleared object
     */
    _.each(_.keys(obj), k => {
      let o = obj[k];
      if (_.isObject(o)) {
        if (o.responseData) {
          o = o.responseData;
        } else if (o.id) {
          o = o.id;
        }
        obj[k] = cleanUp(o);
      }
    });
    return obj;
  },
});

// That's a helper to get the array of nodes from edges
const getNodesFromEdges = (container, prop) => {
  container[prop] = _.map(_.get(container, `${prop}.edges`), 'node');
  return container;
};
const getNodesFromEdgesProperties = (container, ...properties) => {
  _.each(properties, prop => {
    container = getNodesFromEdges(container, prop);
  });
  return container;
};

function resolveV2Fields(item) {
  if (!item.variants) {
    return item;
  }

  const variants = _.map(item.variants, variant => ({
    ...variant,
    price: variant.priceV2?.amount,
    compareAtPrice: variant.compareAtPriceV2?.amount,
  }));

  return { ...item, variants };
}

const productsResolver = accept => container => {
  const p2 = _.map(
    _.get(cleanUp(container, true), 'node.products.edges'),
    product => getNodesFromEdgesProperties(product.node, 'images', 'variants'),
  );

  const p3 = _.map(p2, item => resolveV2Fields(item));

  accept(p3);
};

const productsSearchResolver = accept => shop => {
  const products = _.map(_.get(cleanUp(shop, true), 'products.edges'), 'node');
  const p2 = _.map(products, p =>
    getNodesFromEdgesProperties(p, 'images', 'variants'),
  );

  const p3 = _.map(p2, item => resolveV2Fields(item));

  accept(p3);
};

export const SHOPIFY_ERROR_CODES = {
  UNKNOWN_CUSTOMER: 'UNKNOWN_CUSTOMER',
  ACTIVATE_ACCOUNT: 'ACTIVATE_ACCOUNT',
  INVALID_PHONE: 'INVALID_PHONE',
  PHONE_TAKEN: 'PHONE_TAKEN',
};

export const SHOPIFY_ERRORS = {
  [SHOPIFY_ERROR_CODES.UNKNOWN_CUSTOMER]: 'Unidentified customer',
  [SHOPIFY_ERROR_CODES.ACTIVATE_ACCOUNT]: /We have sent an email to .*, please click the link included to verify your email address./g,
  [SHOPIFY_ERROR_CODES.INVALID_PHONE]:
    'Enter a valid phone number to use this delivery method',
  [SHOPIFY_ERROR_CODES.PHONE_TAKEN]: 'Phone has already been taken',
};

function resolveCustomerUserErrors(customerResponse) {
  if (!customerResponse.customerUserErrors) {
    return customerResponse;
  }

  const { customerUserErrors } = customerResponse;

  if (_.isEmpty(customerUserErrors)) {
    return customerResponse;
  }

  const fullErrorMessage = _.map(
    customerUserErrors,
    error => error.message,
  ).join('\n');

  if (customerUserErrors.length > 1) {
    const fullErrorMessage = _.map(
      customerUserErrors,
      error => error.message,
    ).join('\n');

    return {
      ...customerResponse,
      customerUserErrors: { message: fullErrorMessage },
    };
  }

  const errorMessage = customerUserErrors[0]?.message;

  // The following case means that registration was successful,
  // but customer has to activate account first
  if (errorMessage.match(SHOPIFY_ERRORS.ACTIVATE_ACCOUNT)) {
    return {
      ...customerResponse,
      customerUserErrors: {
        code: SHOPIFY_ERROR_CODES.ACTIVATE_ACCOUNT,
        message: errorMessage,
      },
    };
  }

  if (errorMessage.match(SHOPIFY_ERRORS.PHONE_TAKEN)) {
    return {
      ...customerResponse,
      customerUserErrors: {
        code: SHOPIFY_ERROR_CODES.PHONE_TAKEN,
        message: 'This phone number has already been used for another account',
      },
    };
  }

  if (errorMessage.match(SHOPIFY_ERRORS.INVALID_PHONE)) {
    return {
      ...customerResponse,
      customerUserErrors: {
        code: SHOPIFY_ERROR_CODES.INVALID_PHONE,
        message:
          'Phone number has to include your country calling code (prefixed with +)',
      },
    };
  }

  return {
    ...customerResponse,
    customerUserErrors: { message: fullErrorMessage },
  };
}

const DEFAULT_PAGE_SIZE = 25;

function cleanUpAddresses(customerResponse) {
  if (!customerResponse.customer) {
    return customerResponse;
  }

  const { edges, pageInfo } = _.get(customerResponse, 'customer.addresses', {});
  const cursor = _.get(_.last(edges), 'cursor');

  // Map addresses
  const addresses = _.reduce(
    edges,
    (result, current) => {
      const { node } = current;

      result.push(node);

      return result;
    },
    [],
  );

  return {
    customer: {
      ...customerResponse.customer,
      addresses,
      addressesPageInfo: { ...pageInfo, cursor },
    },
  };
}

function cleanUpOrders(orders) {
  if (!orders) {
    return [];
  }

  const cleanResponse = cleanUp(orders, true);
  const edges = _.get(cleanResponse, 'customer.orders.edges');

  // Map line items
  return _.reduce(
    edges,
    (result, current) => {
      const { cursor, node } = current;
      const { lineItems } = node;
      const cleanLineItems = _.map(lineItems.edges, edge => edge.node);

      const currentOrder = {
        ...node,
        cursor,
        lineItems: cleanLineItems,
        lineItemsPageInfo: {
          cursor: _.last(lineItems.edges).cursor,
          hasNextPage: lineItems.pageInfo.hasNextPage,
        },
      };

      result.push(currentOrder);

      return result;
    },
    [],
  );
}

async function resolveOrderHistory(orders) {
  if (!orders) {
    return [];
  }

  const cleanResponse = cleanUp(orders, true);
  const edges = _.get(cleanResponse, 'customer.orders.edges');

  if (_.isEmpty(edges)) {
    return [];
  }

  const { cursor: newCursor } = _.last(edges);
  const pageInfo = _.get(cleanResponse, 'customer.orders.pageInfo');

  return {
    orders: cleanUpOrders(orders),
    pageInfo: { ...pageInfo, cursor: newCursor },
  };
}

export default {
  // TODO: use promise instead of callback
  initStore: (shop, apiKey, callback = () => {}) => {
    MBBridge.initStore(shop, apiKey, callback);
  },
  getShop: () =>
    new Promise((accept, reject) => {
      MBBridge.getShop()
        .then(o => accept(cleanUp(o, true)))
        .catch(reject);
    }),
  getCollections: () =>
    new Promise((accept, reject) => {
      let resolvedCollections = [];
      const addCollections = collections => {
        const response = cleanUp(collections, true);
        const edges = _.get(response, 'edges');
        const data = _.map(edges, 'node');

        if (data.length > 0) {
          resolvedCollections = _.concat(resolvedCollections, data);
        }

        if (response.pageInfo.hasNextPage) {
          const { cursor } = _.last(edges);
          MBBridge.getCollections(cursor)
            .then(addCollections)
            .catch(reject);
        } else {
          accept(resolvedCollections);
        }
      };

      MBBridge.getCollections('')
        .then(addCollections)
        .catch(reject);
    }),
  getProductsForCollection: collectionId =>
    new Promise((accept, reject) => {
      MBBridge.getProductsForCollection(collectionId)
        .then(productsResolver(accept))
        .catch(reject);
    }),
  filterProducts: filter =>
    new Promise((accept, reject) => {
      MBBridge.filterProducts(filter)
        .then(productsSearchResolver(accept))
        .catch(reject);
    }),
  createCheckoutWithCartAndClientInfo: (cart, userInfo) =>
    new Promise((accept, reject) => {
      MBBridge.createCheckoutWithCartAndClientInfo(cart, userInfo)
        .then(o => accept(cleanUp(o, true)))
        .catch(reject);
    }),
  associateCheckout: checkoutId =>
    new Promise((accept, reject) => {
      MBBridge.associateCheckout(checkoutId)
        .then(o => accept(cleanUp(o, true)))
        .catch(reject);
    }),
  createCustomer: customer =>
    new Promise((accept, reject) =>
      MBBridge.createCustomer(customer)
        .then(res => cleanUp(res, true))
        .then(res => ({
          customerCreate: resolveCustomerUserErrors(res.customerCreate),
        }))
        .then(res => accept(res))
        .catch(reject),
    ),
  login: (email, password) =>
    new Promise((accept, reject) =>
      MBBridge.login({ email, password })
        .then(o => accept(cleanUp(o, true)))
        .catch(reject),
    ),
  refreshToken: () =>
    new Promise((accept, reject) =>
      MBBridge.refreshToken()
        .then(o => accept(o))
        .catch(reject),
    ),
  getAccessToken: () =>
    new Promise((accept, reject) =>
      MBBridge.getAccessToken()
        .then(o => accept(o))
        .catch(reject),
    ),
  // TODO: Android native isLoggedIn method not working
  isLoggedIn: () =>
    new Promise((accept, reject) =>
      MBBridge.getAccessToken()
        .then(o => accept(!_.isEmpty(o)))
        .catch(() => accept(false)),
    ),
  getCustomer: (addressCursor = '') =>
    new Promise((accept, reject) =>
      MBBridge.getCustomer(addressCursor)
        .then(res => cleanUp(res, true))
        .then(res => ({
          customer: resolveCustomerUserErrors(res.customer),
        }))
        .then(res => cleanUpAddresses(res))
        .then(o => accept(o))
        .catch(reject),
    ),
  updateCustomer: userInfo =>
    new Promise((accept, reject) =>
      MBBridge.updateCustomer(userInfo)
        .then(res => cleanUp(res, true))
        .then(res => ({
          customerUpdate: resolveCustomerUserErrors(res.customerUpdate),
        }))
        .then(res => cleanUpAddresses(res))
        .then(o => accept(o))
        .catch(reject),
    ),
  createCustomerAddress: addressInfo =>
    new Promise((accept, reject) =>
      MBBridge.createCustomerAddress(addressInfo)
        .then(o => accept(cleanUp(o, true)))
        .catch(reject),
    ),
  updateCustomerDefaultAddress: addressId =>
    new Promise((accept, reject) =>
      MBBridge.updateCustomerDefaultAddress(addressId)
        .then(o => accept(cleanUp(o, true)))
        .catch(reject),
    ),
  updateCustomerAddress: (addressId, addressInfo) =>
    new Promise((accept, reject) =>
      MBBridge.updateCustomerAddress(addressId, addressInfo)
        .then(o => accept(cleanUp(o, true)))
        .catch(reject),
    ),
  deleteCustomerAddress: addressId =>
    new Promise((accept, reject) =>
      MBBridge.deleteCustomerAddress(addressId)
        .then(o => accept(cleanUp(o, true)))
        .catch(reject),
    ),
  logout: () =>
    new Promise((accept, reject) =>
      MBBridge.logout()
        .then(() => accept())
        .catch(reject),
    ),
  getOrders: (pageSize = DEFAULT_PAGE_SIZE, cursor = '') =>
    new Promise((accept, reject) =>
      MBBridge.getOrderHistory(pageSize, cursor)
        .then(orders => resolveOrderHistory(orders))
        .then(o => accept(o))
        .catch(reject),
    ),
  getOrderByOrderName: (orderName, cursor = '') =>
    new Promise((accept, reject) =>
      MBBridge.getOrderByName(orderName, cursor)
        .then(res => cleanUpOrders(res))
        .then(o => accept(o))
        .catch(reject),
    ),
};
