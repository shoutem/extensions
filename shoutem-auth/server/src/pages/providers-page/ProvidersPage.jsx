import React, { Component, PropTypes } from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import { ControlLabel, FormGroup } from 'react-bootstrap';
import { Switch } from '@shoutem/react-web-ui';
import { updateExtensionSettings } from '@shoutem/redux-api-sdk';
import { getTwitterSettingsUrl } from './services';
import {
  FacebookSetupForm,
  TwitterSetupForm,
  ProviderFormWrapper,
} from './components';
import './style.scss';

export class ProvidersPage extends Component {
  constructor(props) {
    super(props);

    this.handleEmailEnabledChange = this.handleEmailEnabledChange.bind(this);
    this.handleUpdateExtension = this.handleUpdateExtension.bind(this);
  }

  handleEmailEnabledChange(event) {
    const settingsPatch = {
      providers: {
        email: { enabled: event.target.checked }
      },
    };

    this.handleUpdateExtension(settingsPatch);
  }

  handleUpdateExtension(settingsPatch) {
    const { extension } = this.props;
    this.props.updateExtensionSettings(extension, settingsPatch);
  }

  render() {
    const { appId, extension } = this.props;
    const { settings } = extension;

    const emailEnabled = _.get(settings, 'providers.email.enabled', false);
    const facebookSettings = _.get(settings, 'providers.facebook', {});
    const twitterSettings = _.get(settings, 'providers.twitter', {});

    return (
      <div className="providers-page">
        <h3>Select authentication providers</h3>
        <FormGroup className="providers-page__provider">
          <ControlLabel>Email and password</ControlLabel>
          <Switch
            onChange={this.handleEmailEnabledChange}
            value={emailEnabled}
          />
        </FormGroup>
        <ProviderFormWrapper
          providerId="facebook"
          title="Facebook"
          providerSettings={facebookSettings}
          onSetupUpdate={this.handleUpdateExtension}
        >
          <FacebookSetupForm />
        </ProviderFormWrapper>
        <ProviderFormWrapper
          providerId="twitter"
          title="Twitter"
          providerSettings={twitterSettings}
          onSetupUpdate={this.handleUpdateExtension}
        >
          <TwitterSetupForm
            twitterSettingsUrl={getTwitterSettingsUrl(appId)}
          />
        </ProviderFormWrapper>
      </div>
    );
  }
}

ProvidersPage.propTypes = {
  appId: PropTypes.string,
  extension: PropTypes.object,
  updateExtensionSettings: PropTypes.func,
};

function mapDispatchToProps(dispatch) {
  return {
    updateExtensionSettings: (extension, settings) => (
      dispatch(updateExtensionSettings(extension, settings))
    ),
  };
}

export default connect(null, mapDispatchToProps)(ProvidersPage);
