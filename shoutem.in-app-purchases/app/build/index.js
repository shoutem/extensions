const { injectStoreKit } = require('./injectStoreKit');

function preBuild() {
  injectStoreKit();
}

module.exports = {
  preBuild,
  runPreBuild: () => preBuild(),
};
