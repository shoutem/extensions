const pack = require('../package.json');

// defines scope for the current extension state within the global app's state
function ext(resourceName) {
  return resourceName ? `${pack.name}.${resourceName}` : pack.name;
}

const DEFAULT_ADMOB_APPS = {
  IOS: 'ca-app-pub-7090812163729304~6362478856',
  ANDROID: 'ca-app-pub-7090812163729304~5646069659'
};

module.exports = {
  ext,
  DEFAULT_ADMOB_APPS,
};
