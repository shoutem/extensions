import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { FormGroup, Checkbox, ControlLabel, Button, ButtonToolbar } from 'react-bootstrap';
import { isInitialized, shouldRefresh, isBusy, isValid } from '@shoutem/redux-io';
import _ from 'lodash';
import {
  updateExtensionInstallationSettings,
  loadLegacyApplicationSettings,
  updateLegacyApplicationSettings,
} from './../reducer';
import { getExtensionInstallationSettings, mergeSettings } from './../../settings';
import { denormalizeItem } from 'denormalizer';
import { ext } from 'context';
import { getExtensionInstallation, url, appId } from 'environment';
import { LEGACY_APPLICATION_SETTINGS } from 'types';
import './providers.scss';

export class Providers extends Component {
  constructor(props) {
    super(props);
    this.getExtensionInstallationSettings = this.getExtensionInstallationSettings.bind(this);
    this.setExtensionInstallationSettings = this.setExtensionInstallationSettings.bind(this);
    this.getLegacyApplicationSettings = this.getLegacyApplicationSettings.bind(this);
    this.setLegacyApplicationSettings = this.setLegacyApplicationSettings.bind(this);
    this.handleEmailEnabledChange = this.handleEmailEnabledChange.bind(this);
    this.handleAllowNewUserRegistrationChange = this.handleAllowNewUserRegistrationChange.bind(this);
    this.handleFacebookEnabledChange = this.handleFacebookEnabledChange.bind(this);
    this.handleFacebookApiKeyChange = this.handleFacebookApiKeyChange.bind(this);
    this.handleFacebookApiSecretChange = this.handleFacebookApiSecretChange.bind(this);
    this.handleFacebookSaveClick = this.handleFacebookSaveClick.bind(this);
    this.handleTwitterEnabledChange = this.handleTwitterEnabledChange.bind(this);
    this.handleTwitterConsumerKeyChange = this.handleTwitterConsumerKeyChange.bind(this);
    this.handleTwitterConsumerKeySecretChange = this.handleTwitterConsumerKeySecretChange.bind(this);
    this.handleTwitterSaveClick = this.handleTwitterSaveClick.bind(this);
    this.getFacebookSettingsBuilderUrl = this.getFacebookSettingsBuilderUrl.bind(this);
    this.getTwitterSettingsBuilderUrl = this.getTwitterSettingsBuilderUrl.bind(this);

    this.state = {
      legacySettings: {
        facebookApiKey: '',
        facebookSecret: '',
        twitterConsumerKey: '',
        twitterConsumerKeySecret: ''
      },
      facebookError: '',
      twitterError: ''
    }
  }

  componentWillMount() {
    this.props.loadLegacyApplicationSettings();
  }

  componentWillReceiveProps(newProps) {
    if (isInitialized(newProps.legacyApplicationSettings) &&
        shouldRefresh(newProps.legacyApplicationSettings)) {
      this.props.loadLegacyApplicationSettings();
    }

    if ((this.props.legacyApplicationSettings !== newProps.legacyApplicationSettings) &&
      !isBusy(newProps.legacyApplicationSettings)) {
      if (newProps.legacyApplicationSettings) {
        this.setState({ legacySettings: newProps.legacyApplicationSettings });
      }
    }
  }

  getExtensionInstallationSettings() {
    return getExtensionInstallationSettings(this.props.extensionInstallation);
  }

  setExtensionInstallationSettings(settings) {
    const id = this.props.extensionInstallation.id;
    const currentSettings = this.getExtensionInstallationSettings();
    const mergedSettings = mergeSettings(currentSettings, settings); 
    this.props.updateExtensionInstallationSettings(id, mergedSettings);
  }

  getLegacyApplicationSettings() {
    return this.state.legacySettings;
  }

  setLegacyApplicationSettings(settings) {
    this.props.updateLegacyApplicationSettings(settings);
  }

  handleEmailEnabledChange(event) {
    if (!event.target) {
      return;
    }
    const enabled = event.target.checked;
    this.setExtensionInstallationSettings({
      signupEnabled: enabled,
      providers: {
        email: {
          enabled
        }
      }
    });
  }

  handleAllowNewUserRegistrationChange(event) {
    if (!event.target) {
      return;
    }
    this.setExtensionInstallationSettings({ signupEnabled: event.target.checked });
  }

  handleFacebookEnabledChange(event) {
    if (!event.target) {
      return;
    }
    this.setExtensionInstallationSettings({
      providers: {
        facebook: {
          enabled: event.target.checked
        }
      }
    });
  }

  handleFacebookApiKeyChange(event) {
    if (!event.target) {
      return;
    }
    this.setState({
      legacySettings: {
        ...this.state.legacySettings,
        facebookApiKey: event.target.value
      }
    });
  }

  handleFacebookApiSecretChange(event) {
    if (!event.target) {
      return;
    }
    this.setState({
      legacySettings: {
        ...this.state.legacySettings,
        facebookSecret: event.target.value
      }
    });
  }

  handleFacebookSaveClick() {
    const { facebookApiKey, facebookSecret } = this.state.legacySettings;
    if (facebookApiKey && facebookSecret) {
      this.setLegacyApplicationSettings({
        facebookApiKey: facebookApiKey,
        facebookSecret: facebookSecret
      });
      this.setState({ facebookError: '' });
    } else {
      this.setState({ facebookError: 'Invalid Facebook credentials.' });
    }
  }

  handleTwitterEnabledChange(event) {
    if (event.target) {
      this.setExtensionInstallationSettings({
        providers: {
          twitter: {
            enabled: event.target.checked
          }
        }
      });
    }
  }

  handleTwitterConsumerKeyChange(event) {
    if (event.target) {
      this.setState({
        legacySettings: {
          ...this.state.legacySettings,
          twitterConsumerKey: event.target.value
        }
      });
    }
  }

  handleTwitterConsumerKeySecretChange(event) {
    if (event.target) {
      this.setState({
        legacySettings: {
          ...this.state.legacySettings,
          twitterConsumerKeySecret: event.target.value
        }
      });
    }
  }

  handleTwitterSaveClick() {
    const { twitterConsumerKey, twitterConsumerKeySecret } = this.state.legacySettings;
    if (twitterConsumerKey && twitterConsumerKeySecret) {
      this.setLegacyApplicationSettings({
        twitterConsumerKey: twitterConsumerKey,
        twitterConsumerKeySecret: twitterConsumerKeySecret
      });
      this.setState({ twitterError: '' });
    } else {
      this.setState({ twitterError: 'Invalid Twitter credentials.' })
    }
  }

  getFacebookSettingsBuilderUrl() {
    return `//${url.homepage}/builder/settings/sharing/facebook?nid=${appId}`;
  }

  getTwitterSettingsBuilderUrl() {
    return `//${url.homepage}/builder/settings/sharing/twitter?nid=${appId}`;
  }

  render() {
    const settings = this.getExtensionInstallationSettings();
    const signupEnabled = _.get(settings, 'signupEnabled', false);
    const emailEnabled = _.get(settings, 'providers.email.enabled', false);
    const facebookEnabled = _.get(settings, 'providers.facebook.enabled', false);
    const twitterEnabled = _.get(settings, 'providers.twitter.enabled', false);

    const {
      facebookApiKey,
      facebookSecret,
      twitterConsumerKey,
      twitterConsumerKeySecret
    } = this.getLegacyApplicationSettings();

    const {
      facebookError,
      twitterError
    } = this.state;
    
    return (
      <div>
        <form>
          <FormGroup>
            <h3>Select authentication providers</h3>
            <table className="table">
              <tbody>
              <tr>
                <td>
                  <Checkbox
                    checked={emailEnabled}
                    onChange={this.handleEmailEnabledChange}
                  >
                    Email and password
                  </Checkbox>
                </td>
              </tr>
              {emailEnabled && (
                <tr>
                  <td>
                    <h3>Email and password settings</h3>
                    <Checkbox
                      checked={signupEnabled}
                      onChange={this.handleAllowNewUserRegistrationChange}
                    >
                      Allow new user registration
                    </Checkbox>
                  </td>
                </tr>
              )}
              <tr>
                <td>
                  <Checkbox
                    checked={facebookEnabled}
                    onChange={this.handleFacebookEnabledChange}
                  >
                    Facebook
                  </Checkbox>
                </td>
              </tr>
              {facebookEnabled && (
                <tr>
                  <td>
                    <h3>Facebook login setup</h3>
                    <div>
                      <ControlLabel>
                        Make sure you’ve configured your Facebook app under application <a href={this.getFacebookSettingsBuilderUrl()}>Settings</a>
                      </ControlLabel>
                    </div>
                    <ControlLabel>App ID</ControlLabel>
                    <input
                      type="text"
                      className="form-control"
                      value={facebookApiKey}
                      onChange={this.handleFacebookApiKeyChange}
                    />
                    <ControlLabel>App Secret</ControlLabel>
                    <input
                      type="text"
                      className="form-control"
                      value={facebookSecret}
                      onChange={this.handleFacebookApiSecretChange}
                    />
                    {facebookError && (
                      <ControlLabel>{facebookError}</ControlLabel>
                    )}
                    <ButtonToolbar>
                      <Button
                        bsStyle="primary"
                        onClick={this.handleFacebookSaveClick}
                      >
                        Save
                      </Button>
                    </ButtonToolbar>
                  </td>
                </tr>
              )}
              <tr>
                <td>
                  <Checkbox
                    checked={twitterEnabled}
                    onChange={this.handleTwitterEnabledChange}
                  >
                    Twitter
                  </Checkbox>
                </td>
              </tr>
              {twitterEnabled && (
                <tr>
                  <td>
                    <h3>Twitter login setup</h3>
                    <div>
                      <ControlLabel>
                        Make sure you’ve configured your Twitter app under application <a href={this.getTwitterSettingsBuilderUrl()}>Settings</a>
                      </ControlLabel>
                    </div>
                    <ControlLabel>Consumer Key</ControlLabel>
                    <input
                      type="text"
                      className="form-control"
                      value={twitterConsumerKey}
                      onChange={this.handleTwitterConsumerKeyChange}
                    />
                    <ControlLabel>Consumer Key Secret</ControlLabel>
                    <input
                      type="text"
                      className="form-control"
                      value={twitterConsumerKeySecret}
                      onChange={this.handleTwitterConsumerKeySecretChange}
                    />
                    {twitterError && (
                      <ControlLabel>{twitterError}</ControlLabel>
                    )}
                    <ButtonToolbar>
                      <Button
                        bsStyle="primary"
                        onClick={this.handleTwitterSaveClick}
                      >
                        Save
                      </Button>
                    </ButtonToolbar>
                  </td>
                </tr>
              )}
              </tbody>
            </table>
          </FormGroup>
        </form>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    extensionInstallation: getExtensionInstallation(),
    legacyApplicationSettings: denormalizeItem(state[ext()].providersPage.legacyApplicationSettings, undefined, LEGACY_APPLICATION_SETTINGS),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    updateExtensionInstallationSettings: (id, settings) => dispatch(updateExtensionInstallationSettings(id, settings)),
    loadLegacyApplicationSettings: () => dispatch(loadLegacyApplicationSettings()),
    updateLegacyApplicationSettings: (settings) => (dispatch(updateLegacyApplicationSettings(settings)))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Providers);
