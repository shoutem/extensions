const { injectShopifyAndroid, injectShopifyIos } = require('./injectShopify');
const modifyIosProject = require('./modifyIosProject');

function preBuild() {
  injectShopifyAndroid();
  injectShopifyIos();
  modifyIosProject();
}

module.exports = {
  preBuild,
  runPreBuild: () => preBuild(),
};
