module.exports = {
  dependency: {
    hooks: {
      prelink: 'node ./node_modules/shoutem.audio/scripts/set-swift-version.js',
      postlink: 'npx patch-package --patch-dir node_modules/shoutem.audio/patch'
    },
  },
};
