import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { getShortcut } from 'environment';
import _ from 'lodash';
import normalizeUrl from 'normalize-url';
import { updateShortcutSettings } from './../reducer';
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
    this.handleUrlInputContinueClick = this.handleUrlInputContinueClick.bind(this);
    this.handleUrlRemoveClick = this.handleUrlRemoveClick.bind(this);
    this.handleShowNavigationToolbarChange = this.handleShowNavigationToolbarChange.bind(this);
  }

  getActiveScreen() {
    if (_.has(this.props, 'shortcut.settings.url')) {
      return ACTIVE_SCREEN_EDIT;
    }
    return ACTIVE_SCREEN_INPUT;
  }

  getShortcutSettings() {
    const { shortcut } = this.props;
    if (shortcut && shortcut.settings) {
      return this.props.shortcut.settings;
    }
    return {
      url: '',
      showNavigationToolbar: false,
    };
  }

  setShortcutSettings(settings) {
    const id = this.props.shortcut.id;
    const currentSettings = this.getShortcutSettings();
    const mergedSettings = { ...currentSettings, ...settings };
    this.props.updateShortcutSettings(id, mergedSettings);
  }

  handleUrlInputContinueClick(url) {
    const normalizedUrl = normalizeUrl(url);
    this.setShortcutSettings({ url: normalizedUrl });
  }

  handleUrlRemoveClick() {
    this.setShortcutSettings({ url: null });
  }

  handleShowNavigationToolbarChange(checked) {
    this.setShortcutSettings({ showNavigationToolbar: checked });
  }

  render() {
    const activeScreen = this.getActiveScreen();
    const { url, showNavigationToolbar } = this.getShortcutSettings();

    return (
      <div>
        {(activeScreen === ACTIVE_SCREEN_INPUT) && (
          <WebUrlInput
            onContinueClick={this.handleUrlInputContinueClick}
          />
        )}
        {(activeScreen === ACTIVE_SCREEN_EDIT) && (
          <WebEdit
            url={url}
            showNavigationToolbar={showNavigationToolbar}
            onRemoveClick={this.handleUrlRemoveClick}
            onShowNavigationToolbarChange={this.handleShowNavigationToolbarChange}
          />
        )}
      </div>
    );
  }
}

Web.propTypes = {
  shortcut: PropTypes.object,
  updateShortcutSettings: PropTypes.func,
};

function mapStateToProps(state) {
  return {
    shortcut: getShortcut(),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    updateShortcutSettings: (id, settings) => dispatch(updateShortcutSettings(id, settings)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Web);
