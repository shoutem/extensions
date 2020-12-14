const { injectShopifyAndroid, injectShopifyIos } = require('./injectShopify');

exports.preBuild = function preBuild() {
  injectShopifyAndroid();
  injectShopifyIos();
}
