/* global fetch */
import { saveAs } from 'file-saver';
import JSZip from 'jszip';
import _ from 'lodash';
import path from 'path';

function getFileUrls(font) {
  const keys = ['fileUrl', 'boldFileUrl', 'italicFileUrl', 'boldItalicFileUrl'];
  const fileUrls = [];

  _.forEach(keys, key => {
    const value = _.get(font, key);
    if (value) {
      fileUrls.push(value);
    }
  });

  return fileUrls;
}

async function downloadFileUrl(zip, fileUrl) {
  if (!fileUrl) {
    return;
  }

  const response = await fetch(fileUrl);
  const filename = path.basename(fileUrl);

  zip.file(filename, response.blob(), {
    binary: true,
  });
}

export async function downloadFont(font) {
  const fileUrls = getFileUrls(font);
  const zip = new JSZip();

  const promises = _.map(fileUrls, url => downloadFileUrl(zip, url));

  await Promise.all(promises);

  const zipBlob = await zip.generateAsync({ type: 'blob' });

  saveAs(zipBlob, `${font.name}.zip`);
}
