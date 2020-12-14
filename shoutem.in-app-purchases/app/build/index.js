const { injectStoreKit } = require('./injectStoreKit');
const { injectBillingPermission } = require('./injectBillingPermission');

exports.preBuild = function preBuild() {
  injectStoreKit();
  injectBillingPermission();
};
