import _ from 'lodash';

function combineIntoObject(array) {
  return _.reduce(array, (result, value) => ({ ...result, ...value }), {});
}

/**
 * For a given object of images, for each key split images into:
 * - uploadedImages: image URLs of previously uploaded images
 * - newImages: image objects of newly added images from phone
 * @param {object} images
 * @returns images
 */
export function normalizeImageFields(images) {
  return _.reduce(
    images,
    (result, imageField, key) => {
      const resolvedImages = _.reduce(
        imageField,
        (result, image) => {
          if (image.name && image.type) {
            result.newImages.push(image);
          } else {
            result.uploadedImages.push(image);
          }

          return result;
        },
        { uploadedImages: [], newImages: [] },
      );

      result[key] = resolvedImages;
      return result;
    },
    {},
  );
}

/**
 * For a given objects of existing and new images, combine images with same key (form field name).
 * Images uploaded in this session are stored into array of objects:
 *
 * `([ {key:[...images], ...} ])`,
 * so they need to be combined into single object first.
 * @param {object} existingImages Previously uploaded images already saved in user profile
 * @param {object[]} newlyUploadedImages Images uploaded in this session
 * @returns all images
 */
export function resolveImageUpdates(existingImages, newlyUploadedImages) {
  const newImages = combineIntoObject(newlyUploadedImages);

  return _.reduce(
    existingImages,
    (result, imageField, key) => {
      const resolvedNewImages = !!newImages[key] ? newImages[key] : [];

      result[key] = [...imageField.uploadedImages, ...resolvedNewImages];

      return result;
    },
    {},
  );
}

export default { normalizeImageFields, resolveImageUpdates };
