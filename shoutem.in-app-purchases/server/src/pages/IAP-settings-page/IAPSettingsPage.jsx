import React, { PureComponent } from 'react';
import {
  Button,
  ButtonToolbar,
  ControlLabel,
  FormControl,
  FormGroup,
  HelpBlock,
} from 'react-bootstrap';
import { Trans } from 'react-i18next';
import { connect } from 'react-redux';
import autoBindReact from 'auto-bind/react';
import i18next from 'i18next';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { LoaderContainer, Switch } from '@shoutem/react-web-ui';
import {
  fetchExtension,
  getExtension,
  updateExtensionSettings,
} from '@shoutem/redux-api-sdk';
import { shouldRefresh } from '@shoutem/redux-io';
import LOCALIZATION from './localization';
import './style.scss';

const SETTINGS_KEYS = [
  'androidProductId',
  'iOSProductId',
  'iapHubAppId',
  'iapHubApiKey',
  'iapHubEnvironment',
  'subscriptionRequired',
  'singularProductPerScreenEnabled',
];

class IAPSettingsPage extends PureComponent {
  static getDerivedStateFromProps(props, state) {
    const { settings } = props.extension;

    const prevSettings = _.pick(settings, SETTINGS_KEYS);
    const newSettings = _.pick(state.settings, SETTINGS_KEYS);

    if (!_.isEqual(prevSettings, newSettings)) {
      return {
        ...state,
        settings: newSettings,
      };
    }

    return state;
  }

  constructor(props) {
    super(props);

    autoBindReact(this);

    const { settings } = props.extension;

    this.state = {
      loading: false,
      error: null,
      settings: _.pick(settings, SETTINGS_KEYS),
    };
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { extension, fetchExtensionAction } = this.props;
    const { extension: nextExtension } = nextProps;

    if (extension !== nextExtension && shouldRefresh(nextExtension)) {
      fetchExtensionAction();
    }
  }

  saveEnabled() {
    const {
      loading,
      settings: {
        androidProductId,
        iOSProductId,
        iapHubAppId,
        iapHubApiKey,
        iapHubEnvironment,
        singularProductPerScreenEnabled,
      },
    } = this.state;

    const iapHubConfigured =
      !!iapHubAppId && !!iapHubEnvironment && !!iapHubApiKey;
    const productsConfigured =
      singularProductPerScreenEnabled || (iOSProductId && androidProductId);

    if (loading || !iapHubConfigured || !productsConfigured) {
      return false;
    }

    const { settings } = this.state;
    const {
      extension: { settings: prevSettings },
    } = this.props;

    return !_.isEqual(
      _.pick(prevSettings, SETTINGS_KEYS),
      _.pick(settings, SETTINGS_KEYS),
    );
  }

  handleTextSettingChange(fieldName) {
    const { settings } = this.state;

    return event => {
      const newText = event.target.value;

      this.setState({
        settings: { ...settings, [fieldName]: newText },
        error: null,
      });
    };
  }

  handleSubscriptionScreenToggle() {
    const { settings } = this.state;

    this.setState({
      settings: {
        ...settings,
        subscriptionRequired: !settings.subscriptionRequired,
      },
    });
  }

  handlePerScreenGranulationToggle() {
    const { settings } = this.state;

    this.setState({
      settings: {
        ...settings,
        singularProductPerScreenEnabled: !settings.singularProductPerScreenEnabled,
      },
    });
  }

  async handleSave() {
    const { extension, updateExtensionSettingsAction } = this.props;
    const { settings } = this.state;

    this.setState({ loading: true, error: null });

    try {
      await updateExtensionSettingsAction(extension, settings);
      this.setState({ loading: false, error: null });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error);
      this.setState({
        loading: false,
        error: i18next.t(LOCALIZATION.ERROR_MESSAGE),
      });
    }
  }

  render() {
    const {
      loading,
      error,
      settings: {
        iOSProductId,
        androidProductId,
        iapHubAppId,
        iapHubApiKey,
        iapHubEnvironment,
        subscriptionRequired,
        singularProductPerScreenEnabled,
      },
    } = this.state;

    const saveEnabled = this.saveEnabled();

    return (
      <div className="iap-settings-page">
        <div className="instructions-container">
          <p className="instructions">
            <Trans i18nKey={LOCALIZATION.SETUP_INSTRUCTIONS}>
              Learn how to properly set up IAP products
              <a
                href="https://shoutem.com/support/in-app-purchases/"
                target="_blank"
                rel="noreferrer"
              >
                here
              </a>
              .
            </Trans>
          </p>
        </div>
        <form onSubmit={this.handleSubmit}>
          <h3>{i18next.t(LOCALIZATION.GENERAL_SETTINGS_TITLE)}</h3>
          <FormGroup className="switch-form-group">
            <ControlLabel>
              {i18next.t(LOCALIZATION.ENABLE_SUBSCRIPTION_SCREEN)}
            </ControlLabel>
            <Switch
              onChange={this.handleSubscriptionScreenToggle}
              value={subscriptionRequired}
            />
            <ControlLabel>
              {i18next.t(LOCALIZATION.ENABLE_PER_SCREEN_GRANULATION)}
            </ControlLabel>
            <Switch
              onChange={this.handlePerScreenGranulationToggle}
              value={singularProductPerScreenEnabled}
            />
          </FormGroup>
          {!singularProductPerScreenEnabled && (
            <>
              <h3>{i18next.t(LOCALIZATION.STORE_PRODUCTS_TITLE)}</h3>
              <FormGroup>
                <ControlLabel>
                  {i18next.t(LOCALIZATION.IOS_PRODUCT_ID)}
                </ControlLabel>
                <FormControl
                  className="form-control"
                  onChange={this.handleTextSettingChange('iOSProductId')}
                  type="text"
                  value={iOSProductId}
                />
                <ControlLabel>
                  {i18next.t(LOCALIZATION.ANDROD_PRODUCT_ID)}
                </ControlLabel>
                <FormControl
                  className="form-control"
                  onChange={this.handleTextSettingChange('androidProductId')}
                  type="text"
                  value={androidProductId}
                />
              </FormGroup>
            </>
          )}
          <h3>{i18next.t(LOCALIZATION.IAPHUB_SETTINGS_TITLE)}</h3>
          <FormGroup>
            <ControlLabel>{i18next.t(LOCALIZATION.IAPHUB_APP_ID)}</ControlLabel>
            <FormControl
              className="form-control"
              onChange={this.handleTextSettingChange('iapHubAppId')}
              type="text"
              value={iapHubAppId}
            />
            <ControlLabel>
              {i18next.t(LOCALIZATION.IAPHUB_API_KEY)}
            </ControlLabel>
            <FormControl
              className="form-control"
              onChange={this.handleTextSettingChange('iapHubApiKey')}
              type="text"
              value={iapHubApiKey}
            />
            <ControlLabel>
              {i18next.t(LOCALIZATION.IAPHUB_ENVIRONMENT)}
            </ControlLabel>
            <FormControl
              className="form-control"
              onChange={this.handleTextSettingChange('iapHubEnvironment')}
              type="text"
              value={iapHubEnvironment}
            />
          </FormGroup>
        </form>
        {error && (
          <FormGroup validationState="error">
            <HelpBlock>{error}</HelpBlock>
          </FormGroup>
        )}
        <ButtonToolbar>
          <Button
            bsStyle="primary"
            disabled={!saveEnabled}
            onClick={this.handleSave}
          >
            <LoaderContainer isLoading={loading}>
              {i18next.t(LOCALIZATION.SAVE_BUTTON)}
            </LoaderContainer>
          </Button>
        </ButtonToolbar>
      </div>
    );
  }
}

IAPSettingsPage.propTypes = {
  extension: PropTypes.object.isRequired,
  fetchExtensionAction: PropTypes.func.isRequired,
  updateExtensionSettingsAction: PropTypes.func.isRequired,
};

function mapStateToProps(state, ownProps) {
  const { extensionName } = ownProps;
  const extension = getExtension(state, extensionName);

  return {
    extension,
  };
}

function mapDispatchToProps(dispatch, ownProps) {
  const { extensionName } = ownProps;

  return {
    fetchExtensionAction: () => dispatch(fetchExtension(extensionName)),
    updateExtensionSettingsAction: (extension, settings) =>
      dispatch(updateExtensionSettings(extension, settings)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(IAPSettingsPage);
