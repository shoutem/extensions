const shopify = {
  ios: {},
  android: {
    manifest: {
      root: {
        usesSdk:
          '<uses-sdk tools:overrideLibrary="com.shoutem.shopify, com.shopify.buy3" />',
      },
    },
    gradle: {
      app: {
        compileOptions: `compileOptions {
          sourceCompatibility 1.8
          targetCompatibility 1.8
        }`,
      },
    },
  },
};

module.exports = {
  shopify,
};
