module.exports = {
  dependency: {
    hooks: {
      postlink:
        'node ./node_modules/shoutem.shopify/scripts/modify-ios-project.js',
    },
  },
};
