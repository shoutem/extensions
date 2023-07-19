import React from 'react';
import { connect } from 'react-redux';
import { data } from 'context';
import { getShortcut } from 'environment';
import normalizeUrl from 'normalize-url';
import PropTypes from 'prop-types';
import { updateShortcut } from '../reducer';
import WebEdit from './WebEdit';
import WebUrlInput from './WebUrlInput';

function Web({ shortcut, updateShortcut }) {
  const {
    settings: {
      url,
      showNavigationToolbar,
      requireGeolocationPermission,
      requireCookiesPermission,
      forwardAuthHeader,
    },
  } = shortcut;

  const { hasWebsiteSettings } = data.params;

  function updateShortcutSettings(settings) {
    const { id, settings: currentSettings } = shortcut;

    const mergedSettings = { ...currentSettings, ...settings };
    const updatedShortcut = {
      id,
      attributes: {
        settings: mergedSettings,
      },
    };

    updateShortcut(updatedShortcut);
  }

  function handleUrlInputContinueClick(url) {
    const normalizedUrl = normalizeUrl(url, { stripWWW: false });
    updateShortcutSettings({ url: normalizedUrl });
  }

  function handleUrlRemoveClick() {
    updateShortcutSettings({ url: null });
  }

  function handleForwardAuthHeaderChange(checked) {
    updateShortcutSettings({ forwardAuthHeader: checked });
  }

  function handleShowNavigationToolbarChange(checked) {
    updateShortcutSettings({ showNavigationToolbar: checked });
  }

  function handleGeolocationPermissionChange(checked) {
    updateShortcutSettings({ requireGeolocationPermission: checked });
  }

  function handleCookiesPermissionChange(checked) {
    updateShortcutSettings({
      requireCookiesPermission: checked,
    });
  }

  return (
    <div>
      {!url && <WebUrlInput onContinueClick={handleUrlInputContinueClick} />}
      {!!url && (
        <WebEdit
          hasWebsiteSettings={hasWebsiteSettings}
          url={url}
          showNavigationToolbar={showNavigationToolbar}
          forwardAuthHeader={forwardAuthHeader}
          requireCookiesPermission={requireCookiesPermission}
          requireGeolocationPermission={requireGeolocationPermission}
          onRemoveClick={handleUrlRemoveClick}
          onShowNavigationToolbarChange={handleShowNavigationToolbarChange}
          onForwardAuthHeaderChange={handleForwardAuthHeaderChange}
          onRequireGeolocationPermissionChange={
            handleGeolocationPermissionChange
          }
          onRequireCookiesPermissionChange={handleCookiesPermissionChange}
        />
      )}
    </div>
  );
}

Web.propTypes = {
  shortcut: PropTypes.object.isRequired,
  updateShortcut: PropTypes.func.isRequired,
};

function mapStateToProps() {
  const shortcut = getShortcut();

  return {
    shortcut,
    url: shortcut?.settings?.url,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    updateShortcut: shortcut => dispatch(updateShortcut(shortcut)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Web);
