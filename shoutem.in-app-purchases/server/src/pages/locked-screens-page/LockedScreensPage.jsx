import React, { PureComponent } from 'react';
import { ControlLabel, FormGroup } from 'react-bootstrap';
import { connect } from 'react-redux';
import autoBindReact from 'auto-bind/react';
import i18next from 'i18next';
import PropTypes from 'prop-types';
import { LoaderContainer, Switch } from '@shoutem/react-web-ui';
import {
  fetchExtension,
  fetchShortcuts,
  getExtension,
  getShortcuts,
  updateExtensionSettings,
  updateShortcutSettings,
} from '@shoutem/redux-api-sdk';
import { isInitialized, shouldLoad, shouldRefresh } from '@shoutem/redux-io';
import { ProtectedScreenModal, ProtectedScreensTable } from './components';
import LOCALIZATION from './localization';
import './style.scss';

export class LockedScreensPage extends PureComponent {
  constructor(props) {
    super(props);
    autoBindReact(this);

    this.state = {
      settingsModalShown: false,
      currentSettingsShortcut: undefined,
    };
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { extension, fetchExtensionAction } = this.props;
    const { extension: nextExtension } = nextProps;

    if (extension !== nextExtension && shouldRefresh(nextExtension)) {
      fetchExtensionAction();
    }
  }

  componentDidMount() {
    const { fetchShortcuts } = this.props;

    fetchShortcuts();
  }

  componentDidUpdate(prevProps) {
    this.checkData(prevProps);
  }

  checkData(prevProps) {
    if (shouldLoad(this.props, prevProps, 'shortcuts')) {
      const { fetchShortcuts } = this.props;

      fetchShortcuts();
    }
  }

  handleMakeAllScreensPrivateChange() {
    const { extension, updateExtensionSettings } = this.props;
    const {
      settings: { allScreensProtected },
    } = extension;

    const settingsPatch = {
      allScreensProtected: !allScreensProtected,
    };

    updateExtensionSettings(settingsPatch);
  }

  handleShortcutSettingsPress(shortcut) {
    this.setState({
      currentSettingsShortcut: shortcut,
      settingsModalShown: true,
    });
  }

  handleSettingsModalDismiss() {
    this.setState({
      currentSettingsShortcut: undefined,
      settingsModalShown: false,
    });
  }

  async handleShortcutSettingsSave({ androidProductId, iOSProductId }) {
    const { currentSettingsShortcut } = this.state;
    const { updateShortcutSettings } = this.props;

    const settingsPatch = {
      shoutemInAppPurchases: {
        androidProductId,
        iOSProductId,
      },
    };

    await updateShortcutSettings(currentSettingsShortcut, settingsPatch);
    this.setState({ settingsModalShown: false });
  }

  render() {
    const { settingsModalShown, currentSettingsShortcut } = this.state;
    const { extension, shortcuts, updateShortcutSettings } = this.props;
    const { settings: extensionSettings } = extension;
    const {
      allScreensProtected,
      singularProductPerScreenEnabled,
    } = extensionSettings;

    return (
      <div className="locked-screens-page">
        <LoaderContainer isLoading={!isInitialized(shortcuts)}>
          {!singularProductPerScreenEnabled && (
            <FormGroup className="switch-form-group">
              <ControlLabel>
                {i18next.t(LOCALIZATION.LOCK_ALL_SCREENS_HEADING)}
              </ControlLabel>
              <Switch
                className="general-settings__switch"
                onChange={this.handleMakeAllScreensPrivateChange}
                value={allScreensProtected}
              />
            </FormGroup>
          )}
          <ProtectedScreensTable
            shortcuts={shortcuts}
            onShortcutSettingsUpdate={updateShortcutSettings}
            onShortcutSettingsPress={this.handleShortcutSettingsPress}
            allScreensProtected={allScreensProtected}
            settingsModalEnabled={singularProductPerScreenEnabled}
          />
          <ProtectedScreenModal
            visible={settingsModalShown}
            onCancel={this.handleSettingsModalDismiss}
            onSave={this.handleShortcutSettingsSave}
            shortcut={currentSettingsShortcut}
          />
        </LoaderContainer>
      </div>
    );
  }
}

LockedScreensPage.propTypes = {
  extension: PropTypes.object.isRequired,
  fetchExtensionAction: PropTypes.func.isRequired,
  fetchShortcuts: PropTypes.func.isRequired,
  shortcuts: PropTypes.array.isRequired,
  updateExtensionSettings: PropTypes.func.isRequired,
  updateShortcutSettings: PropTypes.func.isRequired,
};

function mapStateToProps(state, ownProps) {
  const { extensionName } = ownProps;
  const extension = getExtension(state, extensionName);

  return {
    shortcuts: getShortcuts(state),
    extension,
  };
}

function mapDispatchToProps(dispatch, ownProps) {
  const { extension, extensionName } = ownProps;

  return {
    updateExtensionSettings: settingsPatch =>
      dispatch(updateExtensionSettings(extension, settingsPatch)),
    fetchShortcuts: () => dispatch(fetchShortcuts()),
    fetchExtensionAction: () => dispatch(fetchExtension(extensionName)),
    updateShortcutSettings: (shortcut, settings) =>
      dispatch(updateShortcutSettings(shortcut, settings)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(LockedScreensPage);
