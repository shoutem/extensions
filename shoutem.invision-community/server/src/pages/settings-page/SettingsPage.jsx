import React, { PureComponent } from 'react';
import autoBindReact from 'auto-bind/react';
import i18next from 'i18next';
import PropTypes from 'prop-types';
import {
  Button,
  ButtonToolbar,
  ControlLabel,
  FormControl,
  FormGroup,
  HelpBlock,
} from 'react-bootstrap';
import { connect } from 'react-redux';
import { LoaderContainer } from '@shoutem/react-web-ui';
import { getExtension, updateExtensionSettings } from '@shoutem/redux-api-sdk';
import LOCALIZATION from './localization';
import './style.scss';

class SettingsPage extends PureComponent {
  static propTypes = {
    extension: PropTypes.object,
    fetchExtension: PropTypes.func,
    updateExtensionSettings: PropTypes.func,
  };

  constructor(props) {
    super(props);

    autoBindReact(this);

    const {
      extension: { settings = {} },
    } = props;

    this.state = {
      invisionApiUrl: settings.invisionApiUrl,
      invisionAuthorizationUrl: settings.invisionAuthorizationUrl,
      clientId: settings.clientId,
      error: null,
      hasChanges: false,
      iconUrl: settings.iconUrl,
      imageUrl: settings.imageUrl,
    };
  }

  handleInputChange(event) {
    this.setState({
      [event.target.name]: event.target.value,
      hasChanges: true,
    });
  }

  handleSave() {
    const { extension, updateExtensionSettings } = this.props;
    const {
      invisionApiUrl: api,
      invisionAuthorizationUrl: authUrl,
      clientId,
      iconUrl,
      imageUrl,
    } = this.state;

    const invisionAuthorizationUrl = authUrl.endsWith('/')
      ? authUrl.replace(/\/$/, '')
      : authUrl;
    const invisionApiUrl = api.endsWith('/') ? api.replace(/\/$/, '') : api;

    this.setState({ invisionApiUrl, invisionAuthorizationUrl, error: '', inProgress: true });
    updateExtensionSettings(extension, {
      invisionApiUrl,
      invisionAuthorizationUrl,
      clientId,
      iconUrl,
      imageUrl,
    })
      .then(() => this.setState({ hasChanges: false, inProgress: false }))
      .catch(error => {
        this.setState({ error, inProgress: false });
      });
  }

  render() {
    const { appId, extensionName } = this.props;
    const {
      invisionApiUrl,
      invisionAuthorizationUrl,
      clientId,
      error,
      hasChanges,
      iconUrl,
      imageUrl,
      inProgress,
    } = this.state;

    // Cannot use 'shoutem.' part of extension canonical name because of
    // whitelabel users.
    const redirectUri = `app${appId}://${extensionName.split('.')[1]}/token`;

    return (
      <div className="settings-page">
        <p>{i18next.t(LOCALIZATION.SCOPE_INSTRUCTIONS)}</p>
        <p>
          {i18next.t(LOCALIZATION.REDIRECTION_INSTRUCTIONS)}
          <br />
          {redirectUri}
        </p>
        <FormGroup>
          <ControlLabel>{i18next.t(LOCALIZATION.API_URL_LABEL)}</ControlLabel>
          <FormControl
            name="invisionApiUrl"
            type="text"
            className="form-control"
            value={invisionApiUrl}
            onChange={this.handleInputChange}
          />
          <ControlLabel>
            {i18next.t(LOCALIZATION.AUTHORIZATION_URL_LABEL)}
          </ControlLabel>
          <FormControl
            name="invisionAuthorizationUrl"
            type="text"
            className="form-control"
            value={invisionAuthorizationUrl}
            onChange={this.handleInputChange}
          />
          <ControlLabel>{i18next.t(LOCALIZATION.CLIENT_ID_LABEL)}</ControlLabel>
          <FormControl
            name="clientId"
            type="text"
            className="form-control"
            value={clientId}
            onChange={this.handleInputChange}
          />
          <ControlLabel>
            {i18next.t(LOCALIZATION.LOGIN_BUTTON_ICON_LABEL)}
          </ControlLabel>
          <FormControl
            name="iconUrl"
            type="text"
            className="form-control"
            value={iconUrl}
            onChange={this.handleInputChange}
          />
          <ControlLabel>
            {i18next.t(LOCALIZATION.LOGIN_SCREEN_IMAGE_LABEL)}
          </ControlLabel>
          <FormControl
            name="imageUrl"
            type="text"
            className="form-control"
            value={imageUrl}
            onChange={this.handleInputChange}
          />
        </FormGroup>
        {error && <HelpBlock className="text-error">{error}</HelpBlock>}
        <ButtonToolbar className="save-button">
          <Button
            bsStyle="primary"
            disabled={!hasChanges}
            onClick={this.handleSave}
          >
            <LoaderContainer isLoading={inProgress}>
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

  return {
    extension: getExtension(state, extensionName),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    updateExtensionSettings: (extension, settings) =>
      dispatch(updateExtensionSettings(extension, settings)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(SettingsPage);
