import { NativeModules, Platform } from 'react-native';
import _ from 'lodash';

const MBBridge = NativeModules.MBBridge;

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

const productsResolver = accept => container => {
  let p2 = _.map(
    _.get(cleanUp(container, true), 'node.products.edges'),
    product => getNodesFromEdgesProperties(product.node, 'images', 'variants')
  );
  accept(p2);
};

const productsSearchResolver = accept => shop => {
  let products = _.map(_.get(cleanUp(shop, true), 'products.edges'), 'node');
  let p2 = _.map(products, p => getNodesFromEdgesProperties(p, 'images', 'variants'))
  accept(p2);
};

export default {
  // TODO: use promise instead of callback
  initStore: (shop, apiKey, callback = () => {}) => {
    MBBridge.initStore(shop, apiKey, callback);
  },
  getShop: () => new Promise((accept, reject) => {
    MBBridge.getShop().then(o => accept(cleanUp(o, true))).catch(reject);
  }),
  getCollections: () => new Promise((accept, reject) => {
    var collections = [];
    const addCollections = shop => {
      var response = cleanUp(shop, true);
      var edges = _.get(response, 'collections.edges');
      var data = _.map(edges, 'node');

      if (data.length > 0) {
        collections = _.concat(collections, data);
      }

      if (response.collections.pageInfo.hasNextPage) {
        const cursor = _.last(edges).cursor;
        MBBridge.getCollections(cursor).then(addCollections).catch(reject);
      }
      else {
        accept(collections);
      }
    };

    MBBridge.getCollections("")
      .then(addCollections)
      .catch(reject);
  }),
  getProductsForCollection: (collectionId) => new Promise((accept, reject) => {
    MBBridge.getProductsForCollection(collectionId)
    .then(productsResolver(accept)).catch(reject);
  }),
  filterProducts: (filter) => new Promise((accept, reject) => {
    MBBridge.filterProducts(filter).then(productsSearchResolver(accept)).catch(reject);
  }),
  createCheckoutWithCartAndClientInfo: (cart, userInfo) => new Promise((accept, reject) => {
    MBBridge.createCheckoutWithCartAndClientInfo(cart, userInfo)
      .then(o => accept(cleanUp(o, true))).catch(reject);
  }),
};
