const { injectStoreKit } = require('./injectStoreKit');
const { injectBillingPermission } = require('./injectBillingPermission');

function preBuild() {
  injectStoreKit();
  injectBillingPermission();
}

module.exports = {
  preBuild,
  runPreBuild: () => preBuild(),
};
