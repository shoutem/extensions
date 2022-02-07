import React from 'react';
import i18next from 'i18next';
import PropTypes from 'prop-types';
import { FontIcon } from '@shoutem/react-web-ui';
import { getWeServUrl } from '../../services';
import LOCALIZATION from './localization';
import './style.scss';

function BannerImagePreview(props) {
  const { imageUrl } = props;

  if (!imageUrl) {
    return null;
  }

  const { onDeleteImageClick } = props;

  const imageSrc = getWeServUrl(imageUrl, 200);

  return (
    <div className="banner-image-preview__container">
      <img
        className="banner-image-preview__image"
        alt={i18next.t(LOCALIZATION.BANNER_IMAGE_ALT_TEXT)}
        src={imageSrc}
      />

      <div className="banner-image-preview__overlay">
        <FontIcon
          onClick={onDeleteImageClick}
          name="delete"
          className="banner-image-preview__icon"
        />
      </div>
    </div>
  );
}

BannerImagePreview.propTypes = {
  imageUrl: PropTypes.string,
  onDeleteImageClick: PropTypes.func.isRequired,
};

BannerImagePreview.defaultProps = {
  imageUrl: undefined,
};

export default BannerImagePreview;
