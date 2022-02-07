import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import autoBindReact from 'auto-bind/react';
import i18next from 'i18next';
import {
  Button,
  ButtonToolbar,
  ControlLabel,
  FormControl,
  FormGroup,
  Label,
} from 'react-bootstrap';
import { LoaderContainer, FontIconPopover, FontIcon } from '@shoutem/react-web-ui';
import {
  fetchExtension,
  updateExtensionSettings,
  getExtension,
} from '@shoutem/redux-api-sdk';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { shouldRefresh } from '@shoutem/redux-io';
import { connect } from 'react-redux';
import greenThumb from '../../../assets/greenThumb.png';
import redThumb from '../../../assets/redThumb.png';
import { DEFAULT_EXTENSION_SETTINGS } from '../../const';
import LOCALIZATION from './localization';
import './style.scss';

const MC_APP_VARIABLES = [
  "appId",
  "accessToken",
  "appEndpoint",
  "fcmSenderId",
];

const MC_API_VARIABLES = [
  "clientId",
  "authBaseUri",
  "restBaseUri",
];

class SalesforceSettingsPage extends Component {
  static propTypes = {
    appId: PropTypes.string,
    extension: PropTypes.object,
    settings: PropTypes.object,
    fetchExtensionAction: PropTypes.func,
    updateExtensionSettingsAction: PropTypes.func,
  };

  constructor(props) {
    super(props);

    autoBindReact(this);

    this.parentContainer = React.createRef();
    props.fetchExtensionAction();

    const salesforceAuthorized = _.get(props, 'settings.salesforceAuthorized', false);

    this.state = {
      loading: false,
      ..._.omit(_.merge({ ...DEFAULT_EXTENSION_SETTINGS }, props.settings), [
        'services',
      ]),
      showSuccess: salesforceAuthorized,
      showFailed: !salesforceAuthorized && props.settings.clientId,
    };
  }

  componentDidMount() {
    window.addEventListener("focus", this.onFocus)
  }

  componentWillUnmount() {
    window.removeEventListener("focus", this.onFocus)
  }

  onFocus() {
    const { fetchExtensionAction } = this.props;

    fetchExtensionAction();
  }

  componentWillReceiveProps(nextProps) {
    const { extension, fetchExtensionAction, settings } = this.props;
    const { extension: nextExtension, settings: nextSettings } = nextProps;

    if (extension !== nextExtension && shouldRefresh(nextExtension)) {
      fetchExtensionAction();
      return;
    }

    const odlApiSettings = _.pick(settings, MC_API_VARIABLES);
    const newApiSettings = _.pick(nextSettings, MC_API_VARIABLES);

    if (_.every(odlApiSettings, setting => !!setting) && !_.isEqual(odlApiSettings, newApiSettings)) {
      this.setState({ showFailed: true, showSuccess: false });
    }

    if (!settings.salesforceAuthorized && nextSettings.salesforceAuthorized) {
      this.setState({ showFailed: false, showSuccess: true, salesforceAuthorized: true });
    }
  }

  handleTextSettingChange(fieldName) {
    return event => {
      const newText = event.target.value;

      this.setState({ [fieldName]: newText });
    };
  }

  handleApiSettingsSubmit(event) {
    event.preventDefault();
    this.handleApiSettingsSave();
  }

  handleAppSettingsSubmit(event) {
    event.preventDefault();
    this.handleAppSettingsSave();
  }

  apiSettingsSaveEnabled() {
    const { clientId, authBaseUri, restBaseUri } = this.state;
    const { settings: oldSettings } = this.props;

    const newSettings = _.pick(this.state, MC_API_VARIABLES);
    const previousSettings = _.pick(
      _.merge({ ...DEFAULT_EXTENSION_SETTINGS }, oldSettings),
      MC_API_VARIABLES,
    );

    return (
      !_.isEqual(newSettings, previousSettings) &&
      !_.isEmpty(clientId) &&
      !_.isEmpty(authBaseUri) &&
      !_.isEmpty(restBaseUri)
    );
  }

  appSettingsSaveEnabled() {
    const { settings: oldSettings } = this.props;

    const newSettings = _.pick(this.state, MC_APP_VARIABLES);
    const previousSettings = _.pick(
      _.merge({ ...DEFAULT_EXTENSION_SETTINGS }, oldSettings),
      MC_APP_VARIABLES,
    );

    return (
      !_.isEqual(newSettings, previousSettings)
      && _.every(newSettings, param => !_.isEmpty(param))
    );
  }

  handleApiSettingsSave() {
    const { extension, updateExtensionSettingsAction } = this.props;

    this.setState({ loading: true });

    updateExtensionSettingsAction(extension, _.pick(this.state, MC_API_VARIABLES))
      .then(() => {
        this.setState({ loading: false, salesforceAuthorized: false });
        this.parentContainer.current.scrollIntoView({ behavior: "smooth", block: "end", inline: "nearest" });;
      })
      .catch(() => this.setState({ loading: false }));
  }

  handleAppSettingsSave() {
    const { extension, updateExtensionSettingsAction } = this.props;

    this.setState({ loading: true });

    updateExtensionSettingsAction(extension, _.pick(this.state, MC_APP_VARIABLES))
      .then(() => this.setState({ loading: false }))
      .catch(() => this.setState({ loading: false }));
  }

  authorizeEnabled() {
    const {
      settings: { clientId, authBaseUri, restBaseUri },
    } = this.props;

    return (
      !_.isEmpty(clientId) && !_.isEmpty(authBaseUri) && !_.isEmpty(restBaseUri)
    );
  }

  composeRedirectUri() {
    const {
      settings: { services },
      appId,
    } = this.props;

    const cloudUri = _.get(
      services,
      'self.cloud',
    );

    return `${cloudUri}/v1/${appId}/redirect`;
  }

  handleCopyClick() {
    const text = this.composeRedirectUri();

    if ('clipboard' in navigator) {
      navigator.clipboard.writeText(text);
    } else {
      return document.execCommand('copy', true, text);
    }
  }

  handleAuthorizePress() {
    const {
      settings: { clientId, authBaseUri },
    } = this.props;

    const redirectUri = encodeURIComponent(this.composeRedirectUri());
    const redirectAddress = `${authBaseUri}v2/authorize?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&scope=list_and_subscribers_read%20list_and_subscribers_write%20offline`;

    window.open(redirectAddress, '_blank');
  }

  render() {
    const {
      loading,
      salesforceAuthorized,
      clientId,
      authBaseUri,
      restBaseUri,
      showFailed,
      showSuccess,
      appId,
      accessToken,
      appEndpoint,
      fcmSenderId,
    } = this.state;

    const apiSettingsSaveDisabled = !this.apiSettingsSaveEnabled();
    const appSettingsSaveDisabled = !this.appSettingsSaveEnabled();
    const redirectUri = this.composeRedirectUri();
    const authorizeDisabled = !this.authorizeEnabled();
    const authorizeButtonTitle = salesforceAuthorized
      ? i18next.t(LOCALIZATION.BUTTON_REAUTHORIZE_TITLE)
      : i18next.t(LOCALIZATION.BUTTON_AUTHORIZE_TITLE);

    return (
      <div
        ref={this.parentContainer}
        className="salesforce-settings-page"
      >
        <form onSubmit={this.handleApiSettingsSubmit}>
          <h3>{i18next.t(LOCALIZATION.APP_CONFIGURATION_TITLE)}</h3>
          <FormGroup>
            <ControlLabel>{i18next.t(LOCALIZATION.APP_APP_ID)}</ControlLabel>
            <FormControl
              className="form-control"
              onChange={this.handleTextSettingChange('appId')}
              type="text"
              value={appId}
            />
            <ControlLabel>
              {i18next.t(LOCALIZATION.APP_ACCESS_TOKEN)}
            </ControlLabel>
            <FormControl
              className="form-control"
              onChange={this.handleTextSettingChange('accessToken')}
              type="text"
              value={accessToken}
            />
            <ControlLabel>
              {i18next.t(LOCALIZATION.APP_APP_ENDPOINT)}
            </ControlLabel>
            <FormControl
              className="form-control"
              onChange={this.handleTextSettingChange('appEndpoint')}
              type="text"
              value={appEndpoint}
            />
            <ControlLabel>
              {i18next.t(LOCALIZATION.APP_FCM_SENDER_ID)}
            </ControlLabel>
            <FormControl
              className="form-control"
              onChange={this.handleTextSettingChange('fcmSenderId')}
              type="text"
              value={fcmSenderId}
            />
          </FormGroup>
        </form>
        <ButtonToolbar>
          <Button
            bsStyle="primary"
            disabled={appSettingsSaveDisabled}
            onClick={this.handleAppSettingsSave}
          >
            <LoaderContainer isLoading={loading}>
              {i18next.t(LOCALIZATION.BUTTON_SAVE_TITLE)}
            </LoaderContainer>
          </Button>
        </ButtonToolbar>
        <form onSubmit={this.handleApiSettingsSubmit}>
          <h3>{i18next.t(LOCALIZATION.API_CONFIGURATION_TITLE)}</h3>
          <FormGroup>
            <ControlLabel>{i18next.t(LOCALIZATION.API_CLIENT_ID)}</ControlLabel>
            <FormControl
              className="form-control"
              onChange={this.handleTextSettingChange('clientId')}
              type="text"
              value={clientId}
            />
            <ControlLabel>
              {i18next.t(LOCALIZATION.API_AUTH_BASE_URI)}
            </ControlLabel>
            <FormControl
              className="form-control"
              onChange={this.handleTextSettingChange('authBaseUri')}
              type="text"
              value={authBaseUri}
            />
            <ControlLabel>
              {i18next.t(LOCALIZATION.API_REST_BASE_URI)}
            </ControlLabel>
            <FormControl
              className="form-control"
              onChange={this.handleTextSettingChange('restBaseUri')}
              type="text"
              value={restBaseUri}
            />
            <div className="redirect-title-container">
              <ControlLabel>
                {i18next.t(LOCALIZATION.API_REDIRECT_URI)}
              </ControlLabel>
              <FontIconPopover
                message={i18next.t(LOCALIZATION.API_REDIRECT_URI_POPOVER)}
              >
                <FontIcon
                  name="info"
                  size="24px"
                  className="salesforce-popover-icon"
                />
              </FontIconPopover>
            </div>
            <div className="label-container">
              <Label bsStyle="primary">{redirectUri}</Label>
              <CopyToClipboard text={redirectUri}>
                <FontIcon
                  name="copy"
                  size="18px"
                  className="salesforce-copy-icon"
                />
              </CopyToClipboard>
            </div>
          </FormGroup>
        </form>
        <ButtonToolbar>
          <Button
            bsStyle="primary"
            disabled={apiSettingsSaveDisabled}
            onClick={this.handleApiSettingsSave}
          >
            <LoaderContainer isLoading={loading}>
              {i18next.t(LOCALIZATION.BUTTON_SAVE_TITLE)}
            </LoaderContainer>
          </Button>
        </ButtonToolbar>
        <h3>{i18next.t(LOCALIZATION.SALESFORCE_AUTHORIZATION_TITLE)}</h3>
        <ButtonToolbar>
          <Button
            bsStyle="primary"
            disabled={authorizeDisabled}
            onClick={this.handleAuthorizePress}
          >
            {authorizeButtonTitle}
          </Button>
          {showSuccess && <img src={greenThumb} alt="greenThumb" />}
          {showFailed && <img src={redThumb} alt="greenThumb" />}
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

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SalesforceSettingsPage);
