import React, { PureComponent } from 'react';
import autoBindReact from 'auto-bind/react';
import i18next from 'i18next';
import _ from 'lodash';
import PropTypes from 'prop-types';
import {
  Button,
  ButtonToolbar,
  ControlLabel,
  FormGroup,
  Jumbotron,
} from 'react-bootstrap';
import { connect } from 'react-redux';
import { LoaderContainer, Switch } from '@shoutem/react-web-ui';
import {
  fetchShortcuts,
  getExtension,
  getShortcuts,
  updateExtensionSettings,
  updateShortcutSettings,
} from '@shoutem/redux-api-sdk';
import { shouldLoad, isInitialized } from '@shoutem/redux-io';
import { RestrictedScreensTable } from './components/restricted-screens-table';
import { StateModal } from './components/states-modal';
import { STATES } from './components/state-row/const';
import LOCALIZATION from './localization';
import './style.scss';

class GeoRestrictionsPage extends PureComponent {
  static propTypes = {
    extension: PropTypes.object,
    extensionSettings: PropTypes.object,
    fetchShortcuts: PropTypes.func,
    shortcut: PropTypes.object,
    updateShortcutSettings: PropTypes.func,
    updateExtensionSettings: PropTypes.func,
  };

  constructor(props) {
    super(props);

    autoBindReact(this);

    this.state = {
      allowedStates: _.get(props, 'extensionSettings.allowedStates', []),
      showModal: false,
    };
  }

  componentDidMount() {
    this.checkData(this.props);
  }

  componentDidUpdate(prevProps) {
    this.checkData(this.props, prevProps);
  }

  checkData(nextProps, props = {}) {
    const { fetchShortcuts } = this.props;

    if (shouldLoad(nextProps, props, 'shortcuts')) {
      fetchShortcuts();
    }
  }

  changeStateSelect(state) {
    const { allowedStates } = this.state;
    const stateCode = _.get(state, 'abbreviation').toString();
    const newStatesArray = [...allowedStates];
    const stateIndex = _.indexOf(newStatesArray, stateCode);

    if (stateIndex === -1) {
      newStatesArray.push(stateCode);

      return this.setState({ allowedStates: newStatesArray });
    }

    newStatesArray.splice(stateIndex, 1);

    return this.setState({ allowedStates: newStatesArray });
  }

  handleSelectNone() {
    return this.setState({ allowedStates: [] });
  }

  handleSelectAll() {
    const allowedStates = _.map(STATES, _.iteratee('abbreviation'));

    return this.setState({ allowedStates });
  }

  handleChangeGeoRestrictionsEnabled() {
    const {
      extension,
      extensionSettings,
      updateExtensionSettings,
    } = this.props;
    const { geoRestrictionsEnabled } = extensionSettings;

    const settingsPatch = {
      geoRestrictionsEnabled: !geoRestrictionsEnabled,
    };

    updateExtensionSettings(extension, settingsPatch);
  }

  onStatesUpdate() {
    const { extension, updateExtensionSettings } = this.props;
    const { allowedStates } = this.state;

    return updateExtensionSettings(extension, { allowedStates }).then(() =>
      this.setState({ showModal: false }),
    );
  }

  changeModalShow() {
    const { showModal } = this.state;

    this.setState({ showModal: !showModal });
  }

  onModalClose() {
    const { extensionSettings } = this.props;
    const { showModal } = this.state;
    const { allowedStates } = extensionSettings;

    this.setState({ allowedStates, showModal: !showModal });
  }

  renderStatesModal() {
    const { allowedStates } = this.state;
    const { extensionSettings } = this.props;

    return (
      <StateModal
        extensionSettings={extensionSettings}
        savedStates={extensionSettings.allowedStates}
        currentAllowedStates={allowedStates}
        onHideModal={this.onModalClose}
        onStateSelect={this.changeStateSelect}
        onSelectNone={this.handleSelectNone}
        onSelectAll={this.handleSelectAll}
        onExtensionSettingsUpdate={this.onStatesUpdate}
      />
    );
  }

  render() {
    const { showModal } = this.state;
    const { shortcuts, extensionSettings } = this.props;
    const { geoRestrictionsEnabled } = extensionSettings;

    return (
      <div className="settings-page">
        <div className="text-area">
          <Jumbotron>
            <b>{i18next.t(LOCALIZATION.INFO_CONTAINER_TITLE)}</b>
            <p> {i18next.t(LOCALIZATION.INFO_CONTAINER_TEXT)}</p>
            <p> <b>{i18next.t(LOCALIZATION.INFO_CONTAINER_WARNING_TEXT)} </b></p>
          </Jumbotron>
        </div>
        <LoaderContainer
          isLoading={!isInitialized(shortcuts)}
          className="protected-screens-page settings-page"
        >
          <h3>{i18next.t(LOCALIZATION.TITLE)}</h3>
          <FormGroup className="switch-form-group">
            <ControlLabel>
              {i18next.t(LOCALIZATION.ENABLE_GEO_RESTRICTION)}
            </ControlLabel>
            <Switch
              className="general-settings__switch"
              onChange={this.handleChangeGeoRestrictionsEnabled}
              value={geoRestrictionsEnabled}
            />
          </FormGroup>
          {geoRestrictionsEnabled && (
            <div>
              <ButtonToolbar className="edit-button">
                <Button bsStyle="primary" onClick={this.changeModalShow}>
                  {i18next.t(LOCALIZATION.EDIT_BUTTON_TITLE)}
                </Button>
              </ButtonToolbar>
              <RestrictedScreensTable
                shortcuts={shortcuts}
                onShortcutSettingsUpdate={this.props.updateShortcutSettings}
              />
            </div>
          )}
        </LoaderContainer>
        {showModal && this.renderStatesModal()}
      </div>
    );
  }
}

function mapStateToProps(state, ownProps) {
  const { extensionName } = ownProps;
  const extension = getExtension(state, extensionName);
  const extensionSettings = _.get(extension, 'settings');
  const shortcuts = getShortcuts(state);

  return {
    extension,
    extensionSettings,
    shortcuts,
  };
}

function mapDispatchToProps(dispatch) {

  return {
    updateExtensionSettings: (extension, settings) =>
      dispatch(updateExtensionSettings(extension, settings)),
    fetchShortcuts: () => dispatch(fetchShortcuts()),
    updateShortcutSettings: (shortcut, settings) =>
      dispatch(updateShortcutSettings(shortcut, settings)),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(GeoRestrictionsPage);
