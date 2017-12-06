import path from 'path';
import { AssetManager } from '@shoutem/assets-sdk';

export default class SettingPageAssetManager {
  constructor(assetPolicyOrigin, scopeType, scopeId, folderName) {
    this.folderName = folderName;

    this.assetManager = new AssetManager({
      scopeType,
      scopeId,
      assetPolicyHost: assetPolicyOrigin,
    });
  }

  uploadFile(file, folderName = this.folderName) {
    const timestamp = new Date().getTime();
    const resolvedPath = `${folderName}/${timestamp}-${file.name}`;
    return this.assetManager.uploadFile(resolvedPath, file);
  }

  listFolder(folderName = this.folderName) {
    return this.assetManager.listFolder(folderName);
  }

  deleteFile(fileUrl, folderName = this.folderName) {
    const fileName = path.basename(fileUrl);
    const deletePath = `${folderName}/${fileName}`;
    return this.assetManager.deleteFile(deletePath);
  }
}
