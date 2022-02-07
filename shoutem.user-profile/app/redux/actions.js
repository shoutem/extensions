import _ from 'lodash';
import { create, update } from '@shoutem/redux-io';
import { getAppId } from 'shoutem.application';
import { getUser } from 'shoutem.auth';
import { ext } from '../const';
import {
  getImageFieldKeys,
  handleError,
  ImageUploadHelpers,
  shoutemApi,
} from '../services';
import { remapImagesArrayToString } from '../services/remap';
import { getUserProfileSchema } from './selectors';

const USER_SCHEMA = 'shoutem.core.users';
const ASSET_POLICIES = 'shoutem.core.asset-policies';

export const SET_PROFILE_SCHEMA = ext('SET_PROFILE_SCHEMA');

const IMAGE_PARAMS = {
  key: 'key',
  acl: 'acl',
  'Content-Type': 'Content-Type',
  'X-Amz-Credential': 'x-amz-credential',
  'X-Amz-Algorithm': 'x-amz-algorithm',
  'X-Amz-Date': 'x-amz-date',
  Policy: 'policy',
  'X-Amz-Signature': 'x-amz-signature',
};

export function setProfileSchema(payload) {
  return {
    type: SET_PROFILE_SCHEMA,
    payload,
  };
}

export function updateProfile(profile) {
  return (dispatch, getState) => {
    const user = getUser(getState());
    const newUser = { id: user.id, profile, type: USER_SCHEMA };

    return dispatch(update(USER_SCHEMA, newUser, { userId: user.id }));
  };
}

function createAssetPolicy(appId, path) {
  return dispatch => {
    const config = {
      schema: ASSET_POLICIES,
      request: {
        endpoint: shoutemApi.buildUrl('/v1/asset-policies'),
        headers: {
          Accept: 'application/vnd.api+json',
          'Content-Type': 'application/vnd.api+json',
        },
      },
    };

    const newAsset = {
      type: ASSET_POLICIES,
      attributes: {
        scopeType: 'application',
        scopeId: appId,
        path,
        action: 'upload',
        contentType: 'image/png',
      },
    };

    return dispatch(create(config, newAsset));
  };
}

function uploadImage(file, endpoint, uploadData) {
  const formData = new FormData();

  _.forOwn(IMAGE_PARAMS, (uploadDataKey, key) =>
    formData.append(key, uploadData[uploadDataKey]),
  );

  formData.append('file', file);

  return new Promise((resolve, reject) => {
    return fetch(endpoint, { method: 'POST', body: formData }).then(res => {
      if (res.status !== 204) {
        reject(res);
      } else {
        const location = _.get(res, 'headers.map.location');

        resolve(location);
      }
    }, reject);
  });
}

function uploadAllImages(appId, key, images) {
  return dispatch => {
    const uploadImagesRequests = _.map(images, image =>
      dispatch(createAssetPolicy(appId, image.name)).then(response => {
        const { endpoint, formData } = _.get(
          response,
          'payload.data.attributes.signedRequest',
        );

        return uploadImage(image, endpoint, formData);
      }),
    );

    return Promise.all(uploadImagesRequests).then(imageUrls => ({
      [key]: imageUrls,
    }));
  };
}

export function submitUserProfile(profileValues, schema) {
  return async (dispatch, getState) => {
    try {
      const state = getState();

      const appId = getAppId(state);
      const profileSchema = getUserProfileSchema(state);

      const imageFieldKeys = getImageFieldKeys(profileSchema);

      const imageFieldsValues = _.pick(profileValues, imageFieldKeys);
      const profileUpdates = _.omit(profileValues, imageFieldKeys);

      const normalizedImageFields = ImageUploadHelpers.normalizeImageFields(
        imageFieldsValues,
      );

      const imageUploadsRequests = _.map(
        normalizedImageFields,
        (imageField, key) => {
          if (imageField.newImages.length > 0) {
            return dispatch(uploadAllImages(appId, key, imageField.newImages));
          }

          return [];
        },
      );

      const uploadedImages = await Promise.all(imageUploadsRequests);

      const imageUpdates = ImageUploadHelpers.resolveImageUpdates(
        normalizedImageFields,
        uploadedImages,
      );

      const remappedImageUpdates = remapImagesArrayToString(
        imageUpdates,
        schema,
      );

      return dispatch(
        updateProfile({ ...profileUpdates, ...remappedImageUpdates }),
      );
    } catch (e) {
      return handleError();
    }
  };
}
