import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
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

export class SettingsPage extends Component {
  constructor(props) {
    super(props);

    this.checkData = this.checkData.bind(this);
    this.handleMakeAllScreensPrivateChange = this.handleMakeAllScreensPrivateChange.bind(this);
  }

  componentWillMount() {
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
    const { settings: { allScreensProtected } } = extension;

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
        <h3>Protected screens</h3>
        <FormGroup className="switch-form-group">
          <ControlLabel>Make all screens private</ControlLabel>
          <Switch
            className="general-settings__switch"
            onChange={this.handleMakeAllScreensPrivateChange}
            value={allScreensProtected}
          />
        </FormGroup>
        {!allScreensProtected &&
          <ProtectedScreensTable
            shortcuts={shortcuts}
            onShortcutSettingsUpdate={this.props.updateShortcutSettings}
          />
        }
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
    updateExtensionSettings: (settingsPatch) => (
      dispatch(updateExtensionSettings(extension, settingsPatch))
    ),
    fetchShortcuts: () => (
      dispatch(fetchShortcuts())
    ),
    updateShortcutSettings: (shortcut, settings) => (
      dispatch(updateShortcutSettings(shortcut, settings))
    ),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(SettingsPage);
