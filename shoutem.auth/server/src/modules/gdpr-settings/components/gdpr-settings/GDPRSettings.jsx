import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import autoBindReact from 'auto-bind/react';
import _ from 'lodash';
import i18next from 'i18next';
import { Button, ControlLabel, FormGroup } from 'react-bootstrap';
import { Switch, FontIcon, FontIconPopover } from '@shoutem/react-web-ui';
import LOCALIZATION from './localization';
import './style.scss';

export default class GDPRSettings extends PureComponent {
  constructor(props) {
    super(props);

    autoBindReact(this);

    this.state = {
      privacyPolicyLink: _.get(
        props,
        'extensionSettings.gdpr.privacyPolicyLink',
      ),
      termsOfServiceLink: _.get(
        props,
        'extensionSettings.gdpr.termsOfServiceLink',
      ),
      consentRequired: _.get(props, 'extensionSettings.gdpr.consentRequired'),
      consentToggleActive: _.get(
        props,
        'extensionSettings.gdpr.consentToggleActive',
      ),
    };
  }

  handleLinksUpdate(event) {
    event.preventDefault();

    const { onExtensionSettingsUpdate } = this.props;
    const {
      privacyPolicyLink,
      termsOfServiceLink,
    } = this.state;

    const settingsPatch = {
      gdpr: {
        privacyPolicyLink,
        termsOfServiceLink,
      },
    };

    onExtensionSettingsUpdate(settingsPatch);
  }

  handlePrivacyPolicyChange(event) {
    const privacyPolicyLink = event.target.value;
    this.setState({ privacyPolicyLink });
  }

  handleTermsChange(event) {
    const termsOfServiceLink = event.target.value;
    this.setState({ termsOfServiceLink });
  }

  handleConsentRequiredChange() {
    const { onExtensionSettingsUpdate } = this.props;
    const { consentRequired } = this.state;

    const settingsPatch = {
      gdpr: {
        consentRequired: !consentRequired,
      },
    };

    onExtensionSettingsUpdate(settingsPatch);
    this.setState({ consentRequired: !consentRequired });
  }

  handleConsentActiveToggle() {
    const { onExtensionSettingsUpdate } = this.props;
    const { consentToggleActive } = this.state;

    const settingsPatch = {
      gdpr: {
        consentToggleActive: !consentToggleActive,
      },
    };

    onExtensionSettingsUpdate(settingsPatch);
    this.setState({ consentToggleActive: !consentToggleActive });
  }

  saveButtonDisabled() {
    const { extensionSettings } = this.props;

    const {
      privacyPolicyLink,
      termsOfServiceLink
    } = this.state;

    const oldPrivacyPolicyLink = _.get(
      extensionSettings,
      'gdpr.privacyPolicyLink',
    );
    const oldTermsOfServiceLink = _.get(
      extensionSettings,
      'gdpr.termsOfServiceLink',
    );

    const hasChanges =
      privacyPolicyLink !== oldPrivacyPolicyLink ||
      termsOfServiceLink !== oldTermsOfServiceLink;

    const valuesSet =
      !_.isEmpty(termsOfServiceLink) &&
      !_.isEmpty(privacyPolicyLink);

    return !hasChanges || !valuesSet;
  }

  render() {
    const {
      privacyPolicyLink,
      termsOfServiceLink,
      consentRequired,
      consentToggleActive,
    } = this.state;

    return (
      <div className="gdpr-settings">
        <h3>{i18next.t(LOCALIZATION.TITLE)}</h3>
        <FormGroup className="switch-form-group">
          <ControlLabel>
            {i18next.t(LOCALIZATION.TERMS_OF_SERVICE_TITLE)}
          </ControlLabel>
          <input
            defaultValue={termsOfServiceLink}
            className="form-control"
            type="text"
            autoFocus
            onChange={this.handleTermsChange}
          />
          <ControlLabel>
            {i18next.t(LOCALIZATION.PRIVACY_POLICY_TITLE)}
          </ControlLabel>
          <input
            defaultValue={privacyPolicyLink}
            className="form-control"
            type="text"
            autoFocus
            onChange={this.handlePrivacyPolicyChange}
          />
        </FormGroup>
        <div className="gdpr-toggle-section">
          <FormGroup className="switch-form-group">
            <ControlLabel>
              {i18next.t(LOCALIZATION.CONSENT_TOGGLE_ACTIVE_TITLE)}
            </ControlLabel>
            <Switch
              checked={consentToggleActive}
              onChange={this.handleConsentActiveToggle}
            />
            <FontIconPopover
              message={i18next.t(LOCALIZATION.CONSENT_TOGGLE_ACTIVE_TOOLTIP)}
            >
              <FontIcon
                className="gdpr-settings__icon-popover"
                name="info"
                size="24px"
              />
            </FontIconPopover>
          </FormGroup>
          <FormGroup className="switch-form-group">
            <ControlLabel>
              {i18next.t(LOCALIZATION.CONSENT_REQUIRED_TITLE)}
            </ControlLabel>
            <Switch
              checked={consentRequired}
              onChange={this.handleConsentRequiredChange}
            />
            <FontIconPopover
              message={i18next.t(LOCALIZATION.CONSENT_REQUIRED_TOOLTIP)}
            >
              <FontIcon
                className="gdpr-settings__icon-popover"
                name="info"
                size="24px"
              />
            </FontIconPopover>
          </FormGroup>
        </div>
        <Button
          disabled={this.saveButtonDisabled()}
          bsStyle="primary"
          onClick={this.handleLinksUpdate}
        >
          {i18next.t(LOCALIZATION.BUTTON_SUBMIT_TITLE)}
        </Button>
      </div>
    );
  }
}

GDPRSettings.propTypes = {
  extensionSettings: PropTypes.object,
  onExtensionSettingsUpdate: PropTypes.func,
};
