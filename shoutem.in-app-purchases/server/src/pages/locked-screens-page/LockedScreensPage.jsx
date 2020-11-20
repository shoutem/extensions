import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import autoBindReact from 'auto-bind/react';
import { ControlLabel, FormGroup } from 'react-bootstrap';
import { LoaderContainer, Switch } from '@shoutem/react-web-ui';
import { shouldLoad, isInitialized } from '@shoutem/redux-io';
import {
  fetchShortcuts,
  updateShortcutSettings,
  getShortcuts,
  updateExtensionSettings,
} from '@shoutem/redux-api-sdk';
import i18next from 'i18next';
import { ProtectedScreensTable } from './components';
import './style.scss';
import LOCALIZATION from './localization';

export class LockedScreensPage extends Component {
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
    if (shouldLoad(nextProps, props, 'shortcuts')) {
      this.props.fetchShortcuts();
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

  render() {
    const { shortcuts, extension } = this.props;
    const { settings: extensionSettings } = extension;
    const { allScreensProtected } = extensionSettings;

    return (
      <div className="locked-screens-page">
        <LoaderContainer isLoading={!isInitialized(shortcuts)}>
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
          <ProtectedScreensTable
            shortcuts={shortcuts}
            onShortcutSettingsUpdate={this.props.updateShortcutSettings}
            allScreensProtected={allScreensProtected}
          />
        </LoaderContainer>
      </div>
    );
  }
}

LockedScreensPage.propTypes = {
  shortcuts: PropTypes.array,
  fetchShortcuts: PropTypes.func,
  extension: PropTypes.object,
  updateShortcutSettings: PropTypes.func,
  updateExtensionSettings: PropTypes.func,
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

export default connect(mapStateToProps, mapDispatchToProps)(LockedScreensPage);
