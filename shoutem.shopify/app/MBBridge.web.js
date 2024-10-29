import { ShopifyClient } from './services';

const COLLECTION_PAGE_SIZE = 250;
const PRODUCTS_PAGE_SIZE = 250;

function resolveProperties(item) {
  if (!item.variants) {
    return item;
  }

  const variants = item.variants.map(variant => {
    return {
      ...variant,
      availableForSale: variant.available,
      price: variant.priceV2?.amount,
      compareAtPrice: variant.compareAtPriceV2?.amount,
      image: {
        ...variant.image,
        url: variant.image.src,
      },
    };
  });

  const images = item.images.map(image => {
    return {
      ...image,
      url: image.src,
    };
  });

  return { ...item, images, variants };
}

function productsResolver(accept, collection) {
  const { products } = collection;

  const p2 = products.map(resolveProperties);

  accept(p2);
}

function productsSearchResolver(accept, products) {
  const p2 = products.map(resolveProperties);

  accept(p2);
}

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

export default {
  // JS SDK initializes the client alongside the native SDK in 'app.js';
  initStore: () => {},
  getShop: () =>
    new Promise((accept, reject) => {
      ShopifyClient.shop
        .fetchInfo()
        .then(accept)
        .catch(reject);
    }),
  getCollections: () =>
    new Promise((accept, reject) => {
      ShopifyClient.collection
        .fetchAll(COLLECTION_PAGE_SIZE)
        .then(accept)
        .catch(reject);
    }),
  getProductsForCollection: collectionId =>
    new Promise((accept, reject) => {
      ShopifyClient.collection
        .fetchWithProducts(collectionId, { productsFirst: PRODUCTS_PAGE_SIZE })
        .then(collection => productsResolver(accept, collection))
        .catch(reject);
    }),
  filterProducts: filter =>
    new Promise((accept, reject) => {
      ShopifyClient.product
        .fetchQuery({ first: PRODUCTS_PAGE_SIZE, query: filter })
        .then(products => productsSearchResolver(accept, products))
        .catch(reject);
    }),
  // TODO: Implement customer-specified note field, nice-to-have
  createCheckoutWithCartAndClientInfo: (cart, userInfo) =>
    new Promise((accept, reject) => {
      const lineItems = cart.map(item => {
        return { variantId: item.id, quantity: item.quantity };
      });
      const shippingAddress = {
        address1: userInfo.address1,
        address2: null,
        city: userInfo.city,
        company: null,
        country: userInfo.countryName,
        firstName: userInfo.firstName,
        lastName: userInfo.lastName,
        phone: null,
        province: userInfo.province,
        zip: userInfo.zip,
      };

      ShopifyClient.checkout
        .create({
          lineItems,
          shippingAddress,
          email: userInfo.email,
        })
        .then(checkout => {
          const resolvedCheckout = {
            checkoutCreate: {
              checkout: {
                checkoutUserErrors: checkout.userErrors,
                availableShippingRates: {},
                ...checkout,
              },
            },
          };

          accept(resolvedCheckout);
        })
        .catch(error => {
          reject(error);
        });
    }),
  // TODO: Implement customer functionality on Web
  associateCheckout: () => new Promise(accept => accept),
  createCustomer: () => new Promise(accept => accept),
  login: () => new Promise(accept => accept),
  refreshToken: () => new Promise(accept => accept),
  getAccessToken: () => new Promise(accept => accept),
  isLoggedIn: () => new Promise(accept => accept(false)),
  getCustomer: () => new Promise(accept => accept),
  updateCustomer: () => new Promise(accept => accept),
  createCustomerAddress: () => new Promise(accept => accept),
  updateCustomerDefaultAddress: () => new Promise(accept => accept),
  updateCustomerAddress: () => new Promise(accept => accept),
  deleteCustomerAddress: () => new Promise(accept => accept),
  logout: () => new Promise(accept => accept),
  getOrders: () => new Promise(accept => accept([])),
  getOrderByOrderName: () => new Promise(accept => accept),
};
