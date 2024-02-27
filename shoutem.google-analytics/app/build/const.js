const pack = require('../package.json');

// defines scope for the current extension state within the global app's state
function ext(resourceName) {
  return resourceName ? `${pack.name}.${resourceName}` : pack.name;
}

module.exports = { ext };
