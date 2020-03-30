module.exports = {
  dependency: {
    hooks: {
      prelink: 'node ./node_modules/shoutem.audio/scripts/set-swift-version.js',
    },
  },
};
