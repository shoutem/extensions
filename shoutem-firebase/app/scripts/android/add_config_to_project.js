/* eslint-disable max-len*/
'use_strict';

const fs = require('fs');

const extensionPath = './node_modules/shoutem.firebase';
const CONFIG_FILE = 'google-services.json';
const configFilePath = `${extensionPath}/${CONFIG_FILE}`;
const configFileDestination = `android/app/${CONFIG_FILE}`;

const readStream = fs.createReadStream(configFilePath);
const writeStream = fs.createWriteStream(configFileDestination);

readStream.on('error', console.log.bind(null, `Unable to read from ${configFilePath}`));
writeStream.on('error', console.log.bind(null, `Unable to write to ${configFileDestination}`));
writeStream.on('finish', console.log.bind(null, `copied ${configFilePath} to ${configFileDestination}`));

readStream.pipe(writeStream);

