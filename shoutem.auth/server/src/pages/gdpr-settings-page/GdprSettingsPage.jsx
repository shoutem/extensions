import React, { Component } from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import autoBindReact from 'auto-bind/react';
import { connect } from 'react-redux';
import { LoaderContainer } from '@shoutem/react-web-ui';
import { shouldLoad, isInitialized } from '@shoutem/redux-io';
import {
  updateExtensionSettings,
  fetchShortcuts,
  getShortcuts,
} from '@shoutem/redux-api-sdk';
import { getAppSettings, loadAppSettings } from 'src/modules/general-settings';
import { GDPRSettings, NewsletterSettings } from 'src/modules/gdpr-settings';
import './style.scss';

export class GdprSettingsPage extends Component {
  constructor(props) {
    super(props);

    autoBindReact(this);
  }

  componentDidMount() {
    this.checkData(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.checkData(nextProps, this.props);
  }

  checkData(nextProps, props = {}) {
    const { appId } = nextProps;
    const { fetchShortcuts, loadAppSettings } = this.props;

    if (shouldLoad(nextProps, props, 'shortcuts')) {
      fetchShortcuts();
    }

    if (shouldLoad(nextProps, props, 'appSettings')) {
      loadAppSettings(appId);
    }
  }

  handleExtensionSettingsUpdate(settingsPatch) {
    const { extension, updateExtensionSettings } = this.props;
    const { settings } = extension;

    const newSettings = _.merge({}, settings, settingsPatch);
    return updateExtensionSettings(extension, newSettings);
  }

  render() {
    const {
      shortcuts,
      appSettings,
      extension: { settings: extensionSettings },
    } = this.props;

    return (
      <LoaderContainer
        className="general-settings-page settings-page"
        isLoading={!isInitialized(shortcuts) || !isInitialized(appSettings)}
      >
        <GDPRSettings
          extensionSettings={extensionSettings}
          onExtensionSettingsUpdate={this.handleExtensionSettingsUpdate}
        />
        <NewsletterSettings
          extensionSettings={extensionSettings}
          onExtensionSettingsUpdate={this.handleExtensionSettingsUpdate}
        />
      </LoaderContainer>
    );
  }
}

GdprSettingsPage.propTypes = {
  appId: PropTypes.string,
  extension: PropTypes.object,
  shortcuts: PropTypes.array,
  appSettings: PropTypes.object,
  loadAppSettings: PropTypes.func,
  updateExtensionSettings: PropTypes.func,
  fetchShortcuts: PropTypes.func,
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
    updateExtensionSettings: (extension, settings) =>
      dispatch(updateExtensionSettings(extension, settings)),
    fetchShortcuts: () => dispatch(fetchShortcuts()),
    loadAppSettings: appId => dispatch(loadAppSettings(appId, scope)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(GdprSettingsPage);
