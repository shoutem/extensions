const { addWebAliases } = require('@shoutem/build-tools');
const { aliases } = require('./const');

function previewBuild() {
  addWebAliases(aliases);
}

module.exports = {
  previewBuild,
};
