// This file is auto-generated.
import { Platform } from 'react-native';
import { PERMISSION_TYPES } from 'shoutem.permissions';
import pack from './package.json';

export const apiVersion = '59';

export const STATUSES_SCHEMA = 'shoutem.social.statuses';
export const USERS_SEARCH_SCHEMA = 'shoutem.core.user-search-actions';
export const SOCIAL_SETTINGS_SCHEMA = 'shoutem.social.settings';

export const DEFAULT_USER_SETTINGS = {
  commentsOnMyStatuses: true,
  likesOnMyStatuses: true,
  commentsOnCommentedStatuses: true,
  commentsOnLikedStatuses: false,
  type: SOCIAL_SETTINGS_SCHEMA,
};

export const CAMERA_PERMISSION = Platform.select({
  ios: PERMISSION_TYPES.IOS_CAMERA,
  default: PERMISSION_TYPES.ANDROID_CAMERA,
});

export const GALLERY_PERMISSION = Platform.select({
  ios: PERMISSION_TYPES.IOS_PHOTO_LIBRARY,
  default: PERMISSION_TYPES.ANDROID_READ_EXTERNAL_STORAGE,
});

export const IMAGE_PICKER_OPTIONS = {
  includeBase64: true,
  maxHeight: 1024,
  maxWidth: 1024,
  mediaType: 'photo',
};

export const MAX_IMAGE_SIZE = 50 * 1024 * 1024;

export function ext(resourceName) {
  return resourceName ? `${pack.name}.${resourceName}` : pack.name;
}
