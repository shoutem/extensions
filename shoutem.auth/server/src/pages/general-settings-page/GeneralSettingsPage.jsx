import PropTypes from 'prop-types';
import React, { Component } from 'react';
import _ from 'lodash';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { ControlLabel, FormGroup } from 'react-bootstrap';
import autoBindReact from 'auto-bind';
import { LoaderContainer, Switch } from '@shoutem/react-web-ui';
import { shouldLoad, isInitialized } from '@shoutem/redux-io';
import {
  updateExtensionSettings,
  fetchShortcuts,
  getShortcuts,
} from '@shoutem/redux-api-sdk';
import {
  getAppSettings,
  getAppStoreSettings,
  loadAppSettings,
  loadAppStoreSettings,
  updateAppSettings,
  updateAppRealm,
  GeneralSettings,
  FacebookSetupForm,
  AppleSetupForm,
} from 'src/modules/general-settings';
import './style.scss';

export class GeneralSettingsPage extends Component {
  constructor(props) {
    super(props);

    autoBindReact(this);
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
      this.props.loadAppSettings(appId);
    }
    if (shouldLoad(nextProps, props, 'storeSettings')) {
      this.props.loadAppStoreSettings(appId);
    }
  }

  handleExtensionSettingsUpdate(settingsPatch) {
    const { extension } = this.props;
    const { settings } = extension;

    const newSettings = _.merge({}, settings, settingsPatch);
    return this.props.updateExtensionSettings(extension, newSettings);
  }

  handleAppSettingsUpdate(settingsPatch) {
    const { appId } = this.props;
    return this.props.updateAppSettings(appId, settingsPatch);
  }

  changeAppleClientId() {
    const { appId, storeSettings, updateAppRealm } = this.props;

    const appleClientId = _.get(storeSettings, 'iphoneBundleId');
    return updateAppRealm(appId, { appleClientId: appleClientId });
  }

  changeFacebookAppId(facebookAppId) {
    const { appId, updateAppRealm } = this.props;
    return updateAppRealm(appId, { facebookAppId: facebookAppId });
  }

  handleEmailEnabledChange(event) {
    const settingsPatch = {
      providers: {
        email: { enabled: event.target.checked },
      },
    };

    this.handleExtensionSettingsUpdate(settingsPatch);
  }

  render() {
    const {
      shortcuts,
      appSettings,
      extension: { settings: extensionSettings },
    } = this.props;

    const emailEnabled = _.get(
      extensionSettings,
      'providers.email.enabled',
      false,
    );
    const facebookSettings = _.get(extensionSettings, 'providers.facebook', {});
    const appleSettings = _.get(extensionSettings, 'providers.apple', {});

    const providerClasses = classNames('general-settings', 'switch-form-group');
    const appleProviderClasses = classNames(providerClasses, 'apple-container');

    return (
      <LoaderContainer
        className="general-settings-page settings-page"
        isLoading={!isInitialized(shortcuts) || !isInitialized(appSettings)}
      >
        <GeneralSettings
          appSettings={appSettings}
          extensionSettings={extensionSettings}
          onAppSettingsUpdate={this.handleAppSettingsUpdate}
          onExtensionSettingsUpdate={this.handleExtensionSettingsUpdate}
        />
        <h3>Select authentication providers</h3>
        <FormGroup className={providerClasses}>
          <ControlLabel>Email and password</ControlLabel>
          <Switch
            onChange={this.handleEmailEnabledChange}
            value={emailEnabled}
          />
        </FormGroup>
        <FacebookSetupForm
          changeAppleClientID={this.changeAppleClientId}
          changeFacebookAppID={this.changeFacebookAppId}
          className={providerClasses}
          onSetupUpdate={this.handleExtensionSettingsUpdate}
          providerSettings={facebookSettings}
        />
        <AppleSetupForm
          changeAppleClientID={this.changeAppleClientId}
          className={appleProviderClasses}
          onSetupUpdate={this.handleExtensionSettingsUpdate}
          providerSettings={appleSettings}
        />
      </LoaderContainer>
    );
  }
}

GeneralSettingsPage.propTypes = {
  appId: PropTypes.string,
  extension: PropTypes.object,
  shortcuts: PropTypes.array,
  appSettings: PropTypes.object,
  storeSettings: PropTypes.object,
  loadAppSettings: PropTypes.func,
  loadAppStoreSettings: PropTypes.func,
  updateExtensionSettings: PropTypes.func,
  fetchShortcuts: PropTypes.func,
  updateAppSettings: PropTypes.func,
  updateAppRealm: PropTypes.func,
};

function mapStateToProps(state) {
  return {
    shortcuts: getShortcuts(state),
    appSettings: getAppSettings(state),
    storeSettings: getAppStoreSettings(state),
  };
}

function mapDispatchToProps(dispatch, ownProps) {
  const { extensionName } = ownProps;
  const scope = { extensionName };

  return {
    updateExtensionSettings: (extension, settings) => dispatch(updateExtensionSettings(extension, settings)),
    fetchShortcuts: () => dispatch(fetchShortcuts()),
    loadAppSettings: appId => dispatch(loadAppSettings(appId, scope)),
    loadAppStoreSettings: appId => dispatch(loadAppStoreSettings(appId, scope)),
    updateAppSettings: (appId, appSettings) => dispatch(updateAppSettings(appId, appSettings, scope)),
    updateAppRealm: (appId, realmPatch) => dispatch(updateAppRealm(appId, realmPatch)),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(GeneralSettingsPage);
