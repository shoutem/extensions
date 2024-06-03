const { injectAgoraSubspecs } = require("./injectAgoraSubspecs");

async function preBuild() {
  injectAgoraSubspecs();
}

function runPreBuild() {
  preBuild();
}

module.exports = {
  preBuild,
  runPreBuild,
};
