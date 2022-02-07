import React, { PureComponent } from 'react';
import { ControlLabel, FormGroup } from 'react-bootstrap';
import { connect } from 'react-redux';
import autoBindReact from 'auto-bind/react';
import i18next from 'i18next';
import PropTypes from 'prop-types';
import { LoaderContainer, Switch } from '@shoutem/react-web-ui';
import {
  fetchShortcuts,
  getShortcuts,
  updateExtensionSettings,
  updateShortcutSettings,
} from '@shoutem/redux-api-sdk';
import { isInitialized, shouldLoad } from '@shoutem/redux-io';
import { ProtectedScreensTable } from './components';
import LOCALIZATION from './localization';
import './style.scss';

export class LockedScreensPage extends PureComponent {
  constructor(props) {
    super(props);
    autoBindReact(this);
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

  render() {
    const { extension, shortcuts, updateShortcutSettings } = this.props;
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
            onShortcutSettingsUpdate={updateShortcutSettings}
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
