import React, { useCallback, useMemo, useState } from 'react';
import { Alert } from 'react-native';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import { ActionSheet, Text } from '@shoutem/ui';
import { unavailableInWeb } from 'shoutem.application';
import { I18n } from 'shoutem.i18n';
import { ext } from '../../../const';
import { ERRORS } from './services/imagePicker';
import { SHAPE_VALUES, SHAPES } from './const';
import EmptyImagesView from './EmptyImagesView';
import ImageCarousel from './ImageCarousel';
import { CIRCULAR_CROP_OPTIONS, ImagePicker } from './services';

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
  const [actionSheetOpen, setActionSheetOpen] = useState(false);

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

  const resolveImages = useCallback(
    async imagePickerAction => {
      try {
        const newImages = await imagePickerAction({
          ...imagePickerOptions,
          maxFiles: maxItems - resolvedImages?.length,
        });

        if (_.isEmpty(newImages)) {
          return;
        }

        onImagesChange([...resolvedImages, ...newImages]);
        setActionSheetOpen(false);
      } catch (e) {
        let error = {
          title: I18n.t(ext('errorTitle')),
          message: I18n.t(ext('errorMessage')),
        };

        if (e?.message === ERRORS.CAMERA_PERMISSION) {
          error = {
            title: I18n.t(ext('cannotAccessCameraTitle')),
            message: I18n.t(ext('cannotAccessCameraMessage')),
          };
        } else if (
          e?.message === ERRORS.CANNOT_ACCESS ||
          e?.message === ERRORS.LIBRARY_PERMISSION ||
          e?.message === ERRORS.REQUIRED_PERMISSION
        ) {
          error = {
            title: I18n.t(ext('galleryPermissionErrorTitle')),
            message: I18n.t(ext('galleryPermissionErrorMessage')),
          };
        }

        // Custom permission denied handler
        if (onPermissionDenied) {
          onPermissionDenied(error.title, error.message);
          return;
        }

        Alert.alert(error.title, error.message);
      }
    },
    [
      imagePickerOptions,
      maxItems,
      onImagesChange,
      onPermissionDenied,
      resolvedImages,
    ],
  );

  // This function has to be defined after resolveImages fn in web, because of dependency.
  // resolveImages fn will update when resolvedImages is changed, which will then update this function.
  // If not defined in this order, this function will have resolveImages with previous values because it hasn't updated yet.
  const actionSheetOptions = useMemo(() => {
    const cancelOptions = [
      {
        title: I18n.t(ext('cancel')),
        onPress: () => setActionSheetOpen(false),
      },
    ];

    const confirmOptions = [
      {
        title: I18n.t(ext('takePhoto')),
        onPress: unavailableInWeb(() => resolveImages(ImagePicker.openCamera)),
      },
      {
        title: I18n.t(ext('chooseFromLibrary')),
        onPress: () => resolveImages(ImagePicker.openPicker),
      },
    ];

    return {
      cancelOptions,
      confirmOptions,
    };
  }, [resolveImages]);

  if (_.isEmpty(resolvedImages)) {
    return (
      <>
        {showLabel && <Text style={style.label}>{label}</Text>}
        <EmptyImagesView
          icon={icon}
          uploadMessage={I18n.t(ext('selectImagesToUpload'))}
          onUploadPress={() => setActionSheetOpen(true)}
        />
        <ActionSheet
          active={actionSheetOpen}
          cancelOptions={actionSheetOptions.cancelOptions}
          confirmOptions={actionSheetOptions.confirmOptions}
          onDismiss={() => setActionSheetOpen(false)}
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
        onAddImage={() => setActionSheetOpen(true)}
      />
      <ActionSheet
        active={actionSheetOpen}
        cancelOptions={actionSheetOptions.cancelOptions}
        confirmOptions={actionSheetOptions.confirmOptions}
        onDismiss={() => setActionSheetOpen(false)}
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
