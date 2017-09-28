import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { LoaderContainer } from '@shoutem/react-web-ui';
import { shouldLoad, isInitialized } from '@shoutem/redux-io';
import {
  updateExtensionSettings,
  fetchShortcuts,
  updateShortcutSettings,
  getShortcuts,
} from '@shoutem/redux-api-sdk';
import {
  getAppSettings,
  loadApplicationSettings,
  updateApplicationSettings,
} from 'src/redux';
import {
  GeneralSettings,
  ProtectedScreenSettings,
} from './components';

export class SettingsPage extends Component {
  constructor(props) {
    super(props);

    this.checkData = this.checkData.bind(this);
    this.handleExtensionSettingsUpdate = this.handleExtensionSettingsUpdate.bind(this);
    this.handleAppSettingsUpdate = this.handleAppSettingsUpdate.bind(this);
  }

  componentWillMount() {
    this.checkData(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.checkData(nextProps, this.props);
  }

  checkData(nextProps, props = {}) {
    const { appId } = nextProps;

    if (shouldLoad(nextProps, props, 'shortcuts')) {
      this.props.fetchShortcuts();
    }

    if (shouldLoad(nextProps, props, 'appSettings')) {
      this.props.loadApplicationSettings(appId);
    }
  }

  handleExtensionSettingsUpdate(settingsPatch) {
    const { extension } = this.props;
    return this.props.updateExtensionSettings(extension, settingsPatch);
  }


  handleAppSettingsUpdate(settingsPatch) {
    const { appId } = this.props;
    return this.props.updateApplicationSettings(appId, settingsPatch);
  }

  render() {
    const { shortcuts, appSettings, extension } = this.props;
    const { settings: extensionSettings } = extension;

    return (
      <LoaderContainer
        isLoading={!isInitialized(shortcuts) || !isInitialized(appSettings)}
        className="settings-page"
      >
        <GeneralSettings
          appSettings={appSettings}
          extensionSettings={extensionSettings}
          onAppSettingsUpdate={this.handleAppSettingsUpdate}
          onExtensionSettingsUpdate={this.handleExtensionSettingsUpdate}
        />
        <ProtectedScreenSettings
          shortcuts={shortcuts}
          onShortcutSettingsUpdate={this.props.updateShortcutSettings}
          extensionSettings={extensionSettings}
        />
      </LoaderContainer>
    );
  }
}

SettingsPage.propTypes = {
  appId: PropTypes.string,
  extension: PropTypes.object,
  shortcuts: PropTypes.array,
  appSettings: PropTypes.object,
  updateExtensionSettings: PropTypes.func,
  fetchShortcuts: PropTypes.func,
  updateShortcutSettings: PropTypes.func,
  loadApplicationSettings: PropTypes.func,
  updateApplicationSettings: PropTypes.func,
};

function mapStateToProps(state) {
  return {
    shortcuts: getShortcuts(state),
    appSettings: getAppSettings(state),
  };
}

function mapDispatchToProps(dispatch, ownProps) {
  const { extensionName } = ownProps;
  const scope = { extensionName };

  return {
    updateExtensionSettings: (extension, settings) => (
      dispatch(updateExtensionSettings(extension, settings))
    ),
    fetchShortcuts: () => (
      dispatch(fetchShortcuts())
    ),
    updateShortcutSettings: (shortcut, settings) => (
      dispatch(updateShortcutSettings(shortcut, settings))
    ),
    loadApplicationSettings: (appId) => (
      dispatch(loadApplicationSettings(appId, scope))
    ),
    updateApplicationSettings: (appId, appSettings) => (
      dispatch(updateApplicationSettings(appId, appSettings, scope))
    ),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(SettingsPage);
