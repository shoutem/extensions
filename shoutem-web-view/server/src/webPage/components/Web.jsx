import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { shouldRefresh, isBusy } from '@shoutem/redux-io';
import { loadShortcut, updateShortcutSettings } from './../reducer';
import { denormalizeItem } from 'denormalizer';
import { getShortcut } from 'environment';
import _ from 'lodash';
import normalizeUrl from 'normalize-url';
import WebUrlInput from './WebUrlInput';
import WebEdit from './WebEdit';

const ACTIVE_SCREEN_INPUT = 0;
const ACTIVE_SCREEN_EDIT = 1;

export class Web extends Component {
  constructor(props) {
    super(props);
    this.getActiveScreen = this.getActiveScreen.bind(this);
    this.getShortcutSettings = this.getShortcutSettings.bind(this);
    this.setShortcutSettings = this.setShortcutSettings.bind(this);
    this.onUrlInputContinueClick = this.onUrlInputContinueClick.bind(this);
    this.onUrlRemoveClick = this.onUrlRemoveClick.bind(this);
    this.onShowNavigationToolbarChange = this.onShowNavigationToolbarChange.bind(this);
    this.onOpenExternalBrowserChange = this.onOpenExternalBrowserChange.bind(this);
  }

  getActiveScreen() {
    if (_.has(this.props, 'shortcut.settings.url')) {
      return ACTIVE_SCREEN_EDIT;
    } else {
      return ACTIVE_SCREEN_INPUT;
    }
  }

  getShortcutSettings() {
    const { shortcut } = this.props;
    if (shortcut && shortcut.settings) {
      return this.props.shortcut.settings;
    }
    return {
      url: '',
      showNavigationToolbar: false,
      openExternalBrowser: false
    };
  }

  setShortcutSettings(settings) {
    const id = this.props.shortcut.id;
    const currentSettings = this.getShortcutSettings();
    const mergedSettings = { ...currentSettings, ...settings };
    this.props.updateShortcutSettings(id, mergedSettings);
  }

  onUrlInputContinueClick(url) {
    const normalizedUrl = normalizeUrl(url);
    this.setShortcutSettings({ url: normalizedUrl });
  }

  onUrlRemoveClick() {
    this.setShortcutSettings({ url: null });
  }

  onShowNavigationToolbarChange(checked) {
    this.setShortcutSettings({ showNavigationToolbar: checked });
  }

  onOpenExternalBrowserChange(checked) {
    this.setShortcutSettings({ openExternalBrowser: checked });
  }

  render() {
    const activeScreen = this.getActiveScreen();
    const { url, showNavigationToolbar, openExternalBrowser } = this.getShortcutSettings();

    return (
      <div>
        {(activeScreen === ACTIVE_SCREEN_INPUT) && (
          <WebUrlInput
            onContinueClick={this.onUrlInputContinueClick}
          />
        )}
        {(activeScreen === ACTIVE_SCREEN_EDIT) && (
          <WebEdit
            url={url}
            showNavigationToolbar={showNavigationToolbar}
            openExternalBrowser={openExternalBrowser}
            onRemoveClick={this.onUrlRemoveClick}
            onShowNavigationToolbarChange={this.onShowNavigationToolbarChange}
            onOpenExternalBrowserChange={this.onOpenExternalBrowserChange}
          />
        )}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    shortcut: getShortcut()
  };
}

function mapDispatchToProps(dispatch) {
  return {
    loadShortcut: id => dispatch(loadShortcut(id)),
    updateShortcutSettings: (id, settings) => dispatch(updateShortcutSettings(id, settings)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Web);
