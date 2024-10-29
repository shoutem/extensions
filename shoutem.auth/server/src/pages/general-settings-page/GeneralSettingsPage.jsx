import React, { Component } from 'react';
import { ControlLabel, FormGroup } from 'react-bootstrap';
import { connect } from 'react-redux';
import autoBindReact from 'auto-bind/react';
import classNames from 'classnames';
import i18next from 'i18next';
import _ from 'lodash';
import PropTypes from 'prop-types';
import {
  AppleSetupForm,
  FacebookSetupForm,
  GeneralSettings,
  getAppSettings,
  getAppStoreSettings,
  loadAppSettings,
  loadAppStoreSettings,
  updateAppRealm,
  updateAppSettings,
} from 'src/modules/general-settings';
import { LoaderContainer, Switch } from '@shoutem/react-web-ui';
import {
  createModule,
  fetchModules,
  fetchShortcuts,
  getModules,
  getShortcuts,
  removeModule,
  updateExtensionSettings,
} from '@shoutem/redux-api-sdk';
import { isInitialized, shouldLoad } from '@shoutem/redux-io';
import LOCALIZATION from './localization';
import './style.scss';

export class GeneralSettingsPage extends Component {
  constructor(props) {
    super(props);

    autoBindReact(this);
  }

  componentDidMount() {
    this.checkData(this.props);
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    this.checkData(nextProps, this.props);
  }

  checkData(nextProps, props = {}) {
    const {
      appId,
      fetchShortcuts,
      fetchModules,
      loadAppSettings,
      loadAppStoreSettings,
    } = this.props;

    if (shouldLoad(nextProps, props, 'shortcuts')) {
      fetchShortcuts();
    }

    if (shouldLoad(nextProps, props, 'appSettings')) {
      loadAppSettings(appId);
    }
    if (shouldLoad(nextProps, props, 'storeSettings')) {
      loadAppStoreSettings(appId);
    }

    if (shouldLoad(nextProps, props, 'modules')) {
      fetchModules();
    }
  }

  handleExtensionSettingsUpdate(settingsPatch) {
    const { extension, updateExtensionSettings } = this.props;
    const { settings } = extension;

    const newSettings = _.merge({}, settings, settingsPatch);

    return updateExtensionSettings(extension, newSettings);
  }

  handleAppSettingsUpdate(settingsPatch) {
    const { appId, updateAppSettings } = this.props;

    return updateAppSettings(appId, settingsPatch);
  }

  handleRealmUpdate(patch) {
    const { appId, updateAppRealm } = this.props;
    return updateAppRealm(appId, patch);
  }

  changeAppleClientId() {
    const { appId, storeSettings, updateAppRealm } = this.props;

    const appleClientId = _.get(storeSettings, 'iphoneBundleId');
    return updateAppRealm(appId, { appleClientId });
  }

  changeFacebookAppId(facebookAppId) {
    const { appId, updateAppRealm } = this.props;
    return updateAppRealm(appId, { facebookAppId });
  }

  handleEmailEnabledChange(event) {
    const settingsPatch = {
      providers: {
        email: { enabled: event.target.checked },
      },
    };

    this.handleExtensionSettingsUpdate(settingsPatch);
  }

  async handleFeatureToggle(featureName, enable) {
    const { modules, createModule, removeModule } = this.props;
    const module = _.find(modules, { name: featureName });

    if (enable && !module) {
      await createModule({ name: featureName });
    }

    if (!enable && module) {
      await removeModule(module);
    }
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
    const trackFbsdkEvents = _.get(
      extensionSettings,
      'trackFbsdkEvents',
      false,
    );
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
          onRealmUpdate={this.handleRealmUpdate}
          onFeatureToggle={this.handleFeatureToggle}
        />
        <h3>{i18next.t(LOCALIZATION.TITLE)}</h3>
        <FormGroup className={providerClasses}>
          <ControlLabel>
            {i18next.t(LOCALIZATION.FORM_EMAIL_PASSWORD_TITLE)}
          </ControlLabel>
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
          trackFbsdkEvents={trackFbsdkEvents}
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
  appId: PropTypes.string.isRequired,
  appSettings: PropTypes.object.isRequired,
  createModule: PropTypes.func.isRequired,
  extension: PropTypes.object.isRequired,
  fetchModules: PropTypes.func.isRequired,
  fetchShortcuts: PropTypes.func.isRequired,
  loadAppSettings: PropTypes.func.isRequired,
  loadAppStoreSettings: PropTypes.func.isRequired,
  modules: PropTypes.array.isRequired,
  removeModule: PropTypes.func.isRequired,
  shortcuts: PropTypes.array.isRequired,
  storeSettings: PropTypes.object.isRequired,
  updateAppRealm: PropTypes.func.isRequired,
  updateAppSettings: PropTypes.func.isRequired,
  updateExtensionSettings: PropTypes.func.isRequired,
};

function mapStateToProps(state) {
  return {
    modules: getModules(state),
    shortcuts: getShortcuts(state),
    appSettings: getAppSettings(state),
    storeSettings: getAppStoreSettings(state),
  };
}

function mapDispatchToProps(dispatch, ownProps) {
  const { extensionName } = ownProps;
  const scope = { extensionName };

  return {
    updateExtensionSettings: (extension, settings) =>
      dispatch(updateExtensionSettings(extension, settings)),
    fetchShortcuts: () => dispatch(fetchShortcuts()),
    loadAppSettings: appId => dispatch(loadAppSettings(appId, scope)),
    loadAppStoreSettings: appId => dispatch(loadAppStoreSettings(appId, scope)),
    updateAppSettings: (appId, appSettings) =>
      dispatch(updateAppSettings(appId, appSettings, scope)),
    updateAppRealm: (appId, realmPatch) =>
      dispatch(updateAppRealm(appId, realmPatch)),
    fetchModules: () => dispatch(fetchModules()),
    createModule: module => dispatch(createModule(module)),
    removeModule: module => dispatch(removeModule(module)),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(GeneralSettingsPage);
