/* eslint-disable max-len*/
'use_strict';

const fs = require('fs');
const MANIFEST_FILE = 'AndroidManifest.xml';

const extensionPath = './node_modules/shoutem.firebase';
const manifestFilePath = `${extensionPath}/${MANIFEST_FILE}`;
const customManifestFileDestination = `android/app/src/customized/${MANIFEST_FILE}`;

const readStream = fs.createReadStream(manifestFilePath);
const writeStream = fs.createWriteStream(customManifestFileDestination, { flags: 'a' });
readStream.on('error', console.log.bind(null, `Unable to read from ${manifestFilePath}`));
writeStream.on('error', console.log.bind(null, `Unable to write to ${customManifestFileDestination}`));
writeStream.on('finish', console.log.bind(null, `copied ${manifestFilePath} to ${customManifestFileDestination}`));

fs.truncate(customManifestFileDestination, 0, (err) => {
  if (err) {
    process.exitCode = 1;
    throw new Error(`Unable to overwrite, ${manifestFilePath} does not exist`);
  }

  console.log(`Overwrite ${customManifestFileDestination} with ${manifestFilePath}`);
  readStream.pipe(writeStream);
});
