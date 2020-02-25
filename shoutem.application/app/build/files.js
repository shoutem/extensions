'use strict';

const fs = require('fs-extra');
const request = require('request');

const writeFile = (filePath, data) => {
  fs.ensureFileSync(filePath);
  fs.writeFileSync(filePath, data, {}, err => {
    console.log(`[preBuild] Unable to save the ${filePath}: ${err}`);
  });
};

const writeJsonToFile = (filePath, json) => {
  fs.ensureFileSync(filePath);
  fs.writeJsonSync(filePath, json, { spaces: 2 }, err => {
    console.log(`[preBuild] Unable to save the ${filePath}: ${err}`);
  });
};

// currently not used, but may prove useful in the future
// eslint-disable-next-line arrow-body-style
const downloadFile = (url, path) => {
  return new Promise((resolve, reject) => {
    request.get(url, (error, response, body) => {
      if (response.statusCode === 200) {
        writeFile(path, body);
        resolve();
      } else {
        reject(`[preBuild] File download from ${url} failed!`);
      }
    }).on('error', (err) => {
      fs.unlink(path);
      reject(err);
    })
  });
};

exports.writeFile = writeFile;
exports.writeJsonToFile = writeJsonToFile;
exports.downloadFile = downloadFile;
