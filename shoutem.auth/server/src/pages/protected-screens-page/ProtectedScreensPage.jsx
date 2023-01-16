import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import autoBindReact from 'auto-bind/react';
import i18next from 'i18next';
import { ControlLabel, FormGroup } from 'react-bootstrap';
import { LoaderContainer, Switch } from '@shoutem/react-web-ui';
import { shouldLoad, isInitialized } from '@shoutem/redux-io';
import {
  updateExtensionSettings,
  fetchShortcuts,
  updateShortcutSettings,
  getShortcuts,
} from '@shoutem/redux-api-sdk';
import { ProtectedScreensTable } from './components';
import LOCALIZATION from './localization';

export class SettingsPage extends Component {
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
    if (shouldLoad(nextProps, props, 'shortcuts')) {
      this.props.fetchShortcuts();
    }
  }

  handleMakeAllScreensPrivateChange() {
    const { extension } = this.props;
    const {
      settings: { allScreensProtected },
    } = extension;

    const settingsPatch = {
      allScreensProtected: !allScreensProtected,
    };

    this.props.updateExtensionSettings(settingsPatch);
  }

  render() {
    const { shortcuts, extension } = this.props;
    const { settings: extensionSettings } = extension;
    const { allScreensProtected } = extensionSettings;

    return (
      <LoaderContainer
        isLoading={!isInitialized(shortcuts)}
        className="protected-screens-page settings-page"
      >
        <h3>{i18next.t(LOCALIZATION.TITLE)}</h3>
        <FormGroup className="switch-form-group">
          <ControlLabel>
            {i18next.t(LOCALIZATION.FORM_MAKE_ALL_SCREENS_PRIVATE_TITLE)}
          </ControlLabel>
          <Switch
            className="general-settings__switch"
            onChange={this.handleMakeAllScreensPrivateChange}
            value={allScreensProtected}
          />
        </FormGroup>
        {!allScreensProtected && (
          <ProtectedScreensTable
            shortcuts={shortcuts}
            onShortcutSettingsUpdate={this.props.updateShortcutSettings}
          />
        )}
      </LoaderContainer>
    );
  }
}

SettingsPage.propTypes = {
  appId: PropTypes.string,
  extension: PropTypes.object,
  shortcuts: PropTypes.array,
  updateExtensionSettings: PropTypes.func,
  fetchShortcuts: PropTypes.func,
  updateShortcutSettings: PropTypes.func,
};

function mapStateToProps(state) {
  return {
    shortcuts: getShortcuts(state),
  };
}

function mapDispatchToProps(dispatch, ownProps) {
  const { extension } = ownProps;

  return {
    updateExtensionSettings: settingsPatch =>
      dispatch(updateExtensionSettings(extension, settingsPatch)),
    fetchShortcuts: () => dispatch(fetchShortcuts()),
    updateShortcutSettings: (shortcut, settings) =>
      dispatch(updateShortcutSettings(shortcut, settings)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(SettingsPage);
