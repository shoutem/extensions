import React from 'react';
import { ControlLabel, FormGroup } from 'react-bootstrap';
import i18next from 'i18next';
import PropTypes from 'prop-types';
import { Checkbox, FontIcon } from '@shoutem/react-web-ui';
import LOCALIZATION from './localization';
import './style.scss';

export default function WebEdit({
  url,
  showNavigationToolbar,
  requireCookiesPermission,
  requireGeolocationPermission,
  hasWebsiteSettings,
  forwardAuthHeader,
  onForwardAuthHeaderChange,
  onRemoveClick,
  onRequireGeolocationPermissionChange,
  onRequireCookiesPermissionChange,
  onShowNavigationToolbarChange,
}) {
  function handleShowNavigationToolbarChange(event) {
    if (event.target) {
      onShowNavigationToolbarChange(event.target.checked);
    }
  }

  function handleForwardAuthHeaderChange(event) {
    if (event.target) {
      onForwardAuthHeaderChange(event.target.checked);
    }
  }

  function handleGeolocationPermissionChange(event) {
    if (event.target) {
      onRequireGeolocationPermissionChange(event.target.checked);
    }
  }

  function handleCookiesPermissionChange(event) {
    if (event.target) {
      onRequireCookiesPermissionChange(event.target.checked);
    }
  }

  return (
    <>
      <FormGroup>
        <ControlLabel>{i18next.t(LOCALIZATION.FORM_WEBSITE_URL)}</ControlLabel>
        <div className="web-edit__url-container">
          <div className="web-edit__web-img" />
          <div className="text-ellipsis">
            <span className="web-edit__url">{url}</span>
          </div>
          <FontIcon
            className="web-edit__remove"
            name="close"
            size="large"
            onClick={onRemoveClick}
          />
        </div>
        {hasWebsiteSettings && (
          <>
            <ControlLabel>
              {i18next.t(LOCALIZATION.FORM_WEBSITE_SETTINGS)}
            </ControlLabel>
            <Checkbox
              checked={requireGeolocationPermission}
              onChange={handleGeolocationPermissionChange}
            >
              {i18next.t(LOCALIZATION.FORM_LOCATION_PERMISSIONS)}
            </Checkbox>
            <Checkbox
              checked={requireCookiesPermission}
              onChange={handleCookiesPermissionChange}
            >
              {i18next.t(LOCALIZATION.FORM_COOKIES_PERMISSIONS)}
            </Checkbox>
            <Checkbox
              checked={showNavigationToolbar}
              onChange={handleShowNavigationToolbarChange}
            >
              {i18next.t(LOCALIZATION.FORM_NAVIGATION_BAR)}
            </Checkbox>
            <Checkbox
              checked={forwardAuthHeader}
              onChange={handleForwardAuthHeaderChange}
            >
              {i18next.t(LOCALIZATION.FORM_FORWARD_AUTH_HEADER)}
            </Checkbox>
          </>
        )}
      </FormGroup>
    </>
  );
}

WebEdit.propTypes = {
  onForwardAuthHeaderChange: PropTypes.func.isRequired,
  onRemoveClick: PropTypes.func.isRequired,
  onRequireCookiesPermissionChange: PropTypes.func.isRequired,
  onRequireGeolocationPermissionChange: PropTypes.func.isRequired,
  onShowNavigationToolbarChange: PropTypes.func.isRequired,
  forwardAuthHeader: PropTypes.bool,
  hasWebsiteSettings: PropTypes.bool,
  requireCookiesPermission: PropTypes.bool,
  requireGeolocationPermission: PropTypes.bool,
  showNavigationToolbar: PropTypes.bool,
  url: PropTypes.string,
};

WebEdit.defaultProps = {
  hasWebsiteSettings: undefined,
  url: undefined,
  showNavigationToolbar: false,
  requireCookiesPermission: false,
  requireGeolocationPermission: false,
  forwardAuthHeader: false,
};
