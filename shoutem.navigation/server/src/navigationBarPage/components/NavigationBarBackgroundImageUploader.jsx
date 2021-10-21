import React, { useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import { appId, url } from 'environment';
import { ImageUploader } from '@shoutem/web-core';
import { UndeletableS3Uploader } from '../../fileUpload';

function NavigationBarBackgroundImages({
  backgroundImage,
  backgroundImagePropertyName,
  className,
  minHeight,
  onImageChange,
  s3folderName,
}) {
  const handleUploadSuccess = useCallback(
    backgroundImage =>
      onImageChange(backgroundImagePropertyName, backgroundImage),
    [backgroundImage],
  );
  const handleDeleteSuccess = useCallback(
    () => onImageChange(backgroundImagePropertyName, null),
    [backgroundImage],
  );
  const uploader = useMemo(
    () =>
      new UndeletableS3Uploader({
        appId,
        basePolicyServerPath: url.apps,
        folderName: s3folderName,
      }),
    [appId, url.apps, s3folderName],
  );

  return (
    <ImageUploader
      className={className}
      previewSize="custom"
      onUploadSuccess={handleUploadSuccess}
      preview={backgroundImage}
      minHeight={minHeight}
      uploader={uploader}
      onDeleteSuccess={handleDeleteSuccess}
    />
  );
}

NavigationBarBackgroundImages.propTypes = {
  backgroundImage: PropTypes.string,
  backgroundImagePropertyName: PropTypes.string,
  className: PropTypes.string,
  minHeight: PropTypes.number.isRequired,
  onImageChange: PropTypes.func,
  s3folderName: PropTypes.string.isRequired,
};

export default React.memo(NavigationBarBackgroundImages);
