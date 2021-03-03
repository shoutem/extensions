require('ts-node/register');
// eslint-disable-next-line @typescript-eslint/no-var-requires
require('../../config/load-config');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const config = require('./cli-config');

module.exports = config;
