import React from 'react';
import i18next from 'i18next';
import PropTypes from 'prop-types';
import { FormInput } from '@shoutem/react-web-ui';
import BannerImagePreview from '../banner-image-preview';
import LOCALIZATION from './localization';

function BannerImage(props) {
  const { imageUrl, onDeleteImageClick, onImageUrlChange } = props;

  return (
    <>
      <FormInput
        elementId="bannerImageUrl"
        error={false}
        name={i18next.t(LOCALIZATION.BANNER_IMAGE_URL_TEXT)}
        onChange={onImageUrlChange}
        value={imageUrl}
      />
      {imageUrl && (
        <BannerImagePreview
          imageUrl={imageUrl}
          onDeleteImageClick={onDeleteImageClick}
        />
      )}
    </>
  );
}

BannerImage.propTypes = {
  imageUrl: PropTypes.string,
  onDeleteImageClick: PropTypes.func.isRequired,
  onImageUrlChange: PropTypes.func.isRequired,
};

BannerImage.defaultProps = {
  imageUrl: undefined,
};

export default React.memo(BannerImage);
