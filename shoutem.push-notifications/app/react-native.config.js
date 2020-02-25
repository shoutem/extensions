module.exports = {
  dependency: {
    hooks: {
      prelink: 'node ./node_modules/shoutem.push-notifications/scripts/add-ios-permission-files.js',
    },
  },
};
