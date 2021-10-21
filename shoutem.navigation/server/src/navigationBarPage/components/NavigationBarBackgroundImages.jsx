import React from 'react';
import i18next from 'i18next';
import PropTypes from 'prop-types';
import { FormGroup, ControlLabel } from 'react-bootstrap';
import NavigationBarBackgroundImageAlert from './NavigationBarBackgroundImageAlert';
import NavigationBarBackgroundImageUploader from './NavigationBarBackgroundImageUploader';
import LOCALIZATION from './localization';

// without notch navbar background image - leaving reducer prop name as is, so we don't break current settings
const WITHOUT_NOTCH_NAVBAR_BACKGROUND_IMAGE = 'backgroundImage';
const WITH_NOTCH_NAVBAR_BACKGROUND_IMAGE = 'withNotchBackgroundImage';
export const WITH_NOTCH_MIN_HEIGHT = 165;
export const WITHOUT_NOTCH_MIN_HEIGHT = 135;

function NavigationBarBackgroundImages({
  onBackgroundImageChange,
  withNotchBackgroundImage,
  withoutNotchBackgroundImage,
}) {
  return (
    <FormGroup className="navigation-bar-page-background-image background-settings">
      <NavigationBarBackgroundImageAlert />
      <div className="navigation-bar-page-background-image__labels-container">
        <ControlLabel>
          {i18next.t(LOCALIZATION.WITHOUT_NOTCH_BACKGROUND_IMAGE, {
            minHeight: WITHOUT_NOTCH_MIN_HEIGHT,
          })}
        </ControlLabel>
        <ControlLabel>
          {i18next.t(LOCALIZATION.WITH_NOTCH_BACKGROUND_IMAGE, {
            minHeight: WITH_NOTCH_MIN_HEIGHT,
          })}
        </ControlLabel>
      </div>
      <div className="navigation-bar-page-background-image__uploader-container">
        <NavigationBarBackgroundImageUploader
          backgroundImage={withoutNotchBackgroundImage}
          backgroundImagePropertyName={WITHOUT_NOTCH_NAVBAR_BACKGROUND_IMAGE}
          className="navigation-bar-page-background-image__uploader navigation-bar-page-background-image__without-notch"
          minHeight={WITHOUT_NOTCH_MIN_HEIGHT}
          onImageChange={onBackgroundImageChange}
          s3folderName="images"
        />
        <NavigationBarBackgroundImageUploader
          backgroundImage={withNotchBackgroundImage}
          backgroundImagePropertyName={WITH_NOTCH_NAVBAR_BACKGROUND_IMAGE}
          className="navigation-bar-page-background-image__uploader navigation-bar-page-background-image__with-notch"
          minHeight={WITH_NOTCH_MIN_HEIGHT}
          onImageChange={onBackgroundImageChange}
          s3folderName="with-notch-navbar-background-image"
        />
      </div>
    </FormGroup>
  );
}

NavigationBarBackgroundImages.propTypes = {
  withNotchBackgroundImage: PropTypes.string,
  withoutNotchBackgroundImage: PropTypes.string,
  onBackgroundImageChange: PropTypes.func,
};

export default React.memo(NavigationBarBackgroundImages);
