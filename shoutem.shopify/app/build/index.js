const { injectShopifyAndroid, injectShopifyIos } = require('./injectShopify');

function preBuild() {
  injectShopifyAndroid();
  injectShopifyIos();
}

module.exports = {
  preBuild,
  runPreBuild: () => preBuild(),
};
