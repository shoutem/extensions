import React, { Component, PropTypes } from 'react';
import _ from 'lodash';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { ControlLabel, FormGroup } from 'react-bootstrap';
import { LoaderContainer, Switch } from '@shoutem/react-web-ui';
import { shouldLoad, isInitialized } from '@shoutem/redux-io';
import {
  updateExtensionSettings,
  fetchShortcuts,
  getShortcuts,
} from '@shoutem/redux-api-sdk';
import {
  getAppSettings,
  loadAppSettings,
  updateAppSettings,
  GeneralSettings,
  FacebookSetupForm,
  ProviderFormWrapper,
} from 'src/modules/general-settings';
import './style.scss';

export class GeneralSettingsPage extends Component {
  constructor(props) {
    super(props);

    this.checkData = this.checkData.bind(this);
    this.handleExtensionSettingsUpdate = this.handleExtensionSettingsUpdate.bind(this);
    this.handleAppSettingsUpdate = this.handleAppSettingsUpdate.bind(this);
    this.handleEmailEnabledChange = this.handleEmailEnabledChange.bind(this);
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

    const emailEnabled = _.get(extensionSettings, 'providers.email.enabled', false);
    const facebookSettings = _.get(extensionSettings, 'providers.facebook', {});

    const providerClasses = classNames(
      'general-settings-page__provider-group',
      'switch-form-group'
    );

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
            value={emailEnabled}
            onChange={this.handleEmailEnabledChange}
          />
        </FormGroup>
        <ProviderFormWrapper
          className={providerClasses}
          providerId="facebook"
          providerSettings={facebookSettings}
          title="Facebook"
          onSetupUpdate={this.handleExtensionSettingsUpdate}
        >
          <FacebookSetupForm />
        </ProviderFormWrapper>
      </LoaderContainer>
    );
  }
}

GeneralSettingsPage.propTypes = {
  appId: PropTypes.string,
  extension: PropTypes.object,
  shortcuts: PropTypes.array,
  appSettings: PropTypes.object,
  loadAppSettings: PropTypes.func,
  updateExtensionSettings: PropTypes.func,
  fetchShortcuts: PropTypes.func,
  updateAppSettings: PropTypes.func,
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
    loadAppSettings: (appId) => (
      dispatch(loadAppSettings(appId, scope))
    ),
    updateAppSettings: (appId, appSettings) => (
      dispatch(updateAppSettings(appId, appSettings, scope))
    ),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(GeneralSettingsPage);
