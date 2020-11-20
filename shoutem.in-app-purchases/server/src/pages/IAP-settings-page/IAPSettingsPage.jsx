import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import autoBindReact from 'auto-bind/react';
import i18next from 'i18next';
import {
  Button,
  ButtonToolbar,
  ControlLabel,
  FormGroup,
  FormControl,
} from 'react-bootstrap';
import { LoaderContainer, Switch } from '@shoutem/react-web-ui';
import {
  fetchExtension,
  updateExtensionSettings,
  getExtension,
} from '@shoutem/redux-api-sdk';
import { shouldRefresh } from '@shoutem/redux-io';
import { connect } from 'react-redux';
import LOCALIZATION from './localization';
import './style.scss';

class IAPSettingsPage extends Component {
  static propTypes = {
    extension: PropTypes.object,
    settings: PropTypes.object,
    fetchExtensionAction: PropTypes.func,
    updateExtensionSettingsAction: PropTypes.func,
  };

  constructor(props) {
    super(props);

    autoBindReact(this);

    props.fetchExtensionAction();

    this.state = {
      loading: false,
      ..._.get(props, 'settings', {}),
    };
  }

  componentWillReceiveProps(nextProps) {
    const { extension, fetchExtensionAction } = this.props;
    const { extension: nextExtension } = nextProps;

    if (extension !== nextExtension && shouldRefresh(nextExtension)) {
      fetchExtensionAction();
    }
  }

  saveEnabled() {
    const {
      loading,
      iOSProductId,
      androidProductId,
      iapHubAppId,
      iapHubApiKey,
      iapHubEnvironment,
    } = this.state;
    const { settings: oldSettings } = this.props;

    const newSettings = _.omit(this.state, 'loading');
    const iapHubConfigured =
      !_.isEmpty(iapHubAppId) && !_.isEmpty(iapHubEnvironment) && !_.isEmpty(iapHubApiKey);

    return (
      !_.isEqual(newSettings, oldSettings) &&
      (!_.isEmpty(iOSProductId) || !_.isEmpty(androidProductId)) &&
      iapHubConfigured &&
      !loading
    );
  }

  handleTextSettingChange(fieldName) {
    return event => {
      const newText = event.target.value;

      this.setState({ [fieldName]: newText });
    };
  }

  handleSubscriptionScreenToggle() {
    const { subscriptionRequired } = this.state;

    this.setState({ subscriptionRequired: !subscriptionRequired });
  }

  handleSave() {
    const { extension, updateExtensionSettingsAction } = this.props;

    this.setState({ loading: true });

    updateExtensionSettingsAction(extension, {
      ..._.omit(this.state, 'loading'),
    })
      .then(() => this.setState({ loading: false }))
      .catch(() => this.setState({ loading: false }));
  }

  render() {
    const {
      loading,
      iOSProductId,
      androidProductId,
      iapHubAppId,
      iapHubApiKey,
      iapHubEnvironment,
      subscriptionRequired,
    } = this.state;

    const saveEnabled = this.saveEnabled();

    return (
      <div className="chat-settings-page">
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
          </FormGroup>
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

function mapStateToProps(state, ownProps) {
  const { extensionName } = ownProps;
  const extension = getExtension(state, extensionName);
  const settings = _.get(extension, 'settings', {});

  return {
    extension,
    settings,
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
