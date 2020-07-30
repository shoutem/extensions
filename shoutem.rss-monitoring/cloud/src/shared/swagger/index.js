import _ from 'lodash';
import fs from 'fs';
import glob from 'glob';
import YAML from 'yaml-js';
import extendify from 'extendify';
import config from './config';
import packageInfo from '../../../package.json';

const contents = [];

glob.sync('src/**/*-swagger.yaml').forEach((file) => {
  const content = YAML.load(fs.readFileSync(file).toString());
  contents.push(content);
});

const extend = extendify({
  inPlace: false,
  isDeep: true,
});

const apiSpec = contents.reduce(extend);

// Override API host from config
_.set(apiSpec, 'host', config.swaggerBaseUrl);

// Override title and version from package.json
_.set(apiSpec, 'info.title', `${packageInfo.name} Swagger API`);
_.set(apiSpec, 'info.version', packageInfo.version);

export default apiSpec;
