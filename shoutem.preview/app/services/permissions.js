import { Platform } from 'react-native';
import { PERMISSION_TYPES } from 'shoutem.permissions';

export const GALLERY_PERMISSION = Platform.select({
  ios: PERMISSION_TYPES.IOS_PHOTO_LIBRARY,
  default: PERMISSION_TYPES.ANDROID_WRITE_EXTERNAL_STORAGE,
});
