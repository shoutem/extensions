import React, { useMemo } from 'react';
import { Alert } from 'react-native';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import { Text } from '@shoutem/ui';
import { I18n } from 'shoutem.i18n';
import { ext } from '../../../const';
import imagePicker from './services/imagePicker';
import { SHAPE_VALUES, SHAPES } from './const';
import EmptyImagesView from './EmptyImagesView';
import ImageCarousel from './ImageCarousel';
import {
  CIRCULAR_CROP_OPTIONS,
  ImagePicker,
  openActionSheet,
} from './services';

export function ImageUpload({
  icon,
  value: images,
  label,
  maxItems,
  onPermissionDenied,
  onInputChange: onImagesChange,
  variant: shape,
  showLabel,
  style,
}) {
  // Backward compatibility for when we were saving images as a single string
  const resolvedImages = useMemo(
    () => (_.isArray(images) ? images : [images]),
    [images],
  );

  const isCircular = useMemo(() => shape === SHAPES.CIRCLE, [shape]);

  const imagePickerOptions = useMemo(
    () => (isCircular ? CIRCULAR_CROP_OPTIONS : {}),
    [isCircular],
  );

  async function resolveImages(imagePickerAction) {
    try {
      const newImages = await imagePickerAction({
        ...imagePickerOptions,
        maxFiles: maxItems - resolvedImages?.length,
      });

      if (_.isEmpty(newImages)) {
        return null;
      }

      return onImagesChange([...resolvedImages, ...newImages]);
    } catch (e) {
      let error = {
        title: I18n.t(ext('errorTitle')),
        message: I18n.t(ext('errorMessage')),
      };

      if (e?.message === imagePicker.ERRORS.CAMERA_PERMISSION) {
        error = {
          title: I18n.t(ext('cannotAccessCameraTitle')),
          message: I18n.t(ext('cannotAccessCameraMessage')),
        };
      } else if (
        e?.message === imagePicker.ERRORS.CANNOT_ACCESS ||
        e?.message === imagePicker.ERRORS.LIBRARY_PERMISSION ||
        e?.message === imagePicker.ERRORS.REQUIRED_PERMISSION
      ) {
        error = {
          title: I18n.t(ext('galleryPermissionErrorTitle')),
          message: I18n.t(ext('galleryPermissionErrorMessage')),
        };
      }

      // Custom permission denied handler
      if (onPermissionDenied) {
        return onPermissionDenied(error.title, error.message);
      }

      return Alert.alert(error.title, error.message);
    }
  }

  function handleOpenActionSheet() {
    const actionSheetOptionActions = [
      () => resolveImages(ImagePicker.openCamera),
      () => resolveImages(ImagePicker.openPicker),
    ];

    return openActionSheet(
      [
        I18n.t(ext('takePhoto')),
        I18n.t(ext('chooseFromLibrary')),
        I18n.t(ext('cancel')),
      ],
      actionSheetOptionActions,
      {
        tintColor: style.actionSheet.tintColor,
        userInterfaceStyle: style.actionSheet.userInterfaceStyle,
      },
    );
  }

  if (_.isEmpty(resolvedImages)) {
    return (
      <>
        {showLabel && <Text style={style.label}>{label}</Text>}
        <EmptyImagesView
          icon={icon}
          uploadMessage={I18n.t(ext('selectImagesToUpload'))}
          onUploadPress={handleOpenActionSheet}
        />
      </>
    );
  }

  return (
    <>
      {showLabel && <Text style={style.label}>{label}</Text>}
      <ImageCarousel
        style={style.imageCarousel}
        images={resolvedImages}
        isCircular={isCircular}
        maxItems={maxItems}
        onImagesChange={onImagesChange}
        onAddImage={handleOpenActionSheet}
      />
    </>
  );
}

ImageUpload.propTypes = {
  label: PropTypes.string.isRequired,
  style: PropTypes.object.isRequired,
  icon: PropTypes.string,
  maxItems: PropTypes.number,
  showLabel: PropTypes.bool,
  value: PropTypes.array,
  variant: PropTypes.oneOf(SHAPE_VALUES),
  onInputChange: PropTypes.func,
  onPermissionDenied: PropTypes.func,
};

ImageUpload.defaultProps = {
  icon: 'attach-media',
  maxItems: 5,
  onInputChange: null,
  onPermissionDenied: undefined,
  value: [],
  variant: 'rectangle',
  showLabel: true,
};

export default connectStyle(ext('ImageUpload'))(ImageUpload);
