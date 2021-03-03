import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import i18next from 'i18next';
import autoBindReact from 'auto-bind/react';
import { ControlLabel, FormGroup } from 'react-bootstrap';
import { Switch, FontIcon, FontIconPopover } from '@shoutem/react-web-ui';
import LOCALIZATION from './localization';
import './style.scss';

export default class NewsletterSettings extends PureComponent {
  constructor(props) {
    super(props);

    autoBindReact(this);

    this.state = {
      consentToggleActive: _.get(
        props,
        'extensionSettings.newsletter.consentToggleActive',
      ),
    };
  }

  handleConsentActiveToggle() {
    const { onExtensionSettingsUpdate } = this.props;
    const { consentToggleActive } = this.state;

    const settingsPatch = {
      newsletter: {
        consentToggleActive: !consentToggleActive,
      },
    };

    onExtensionSettingsUpdate(settingsPatch);
    this.setState({ consentToggleActive: !consentToggleActive });
  }

  render() {
    const { consentToggleActive } = this.state;

    return (
      <div className="newsletter-settings">
        <h3>{i18next.t(LOCALIZATION.TITLE)}</h3>
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
              className="newsletter-settings__icon-popover"
              name="info"
              size="24px"
            />
          </FontIconPopover>
        </FormGroup>
      </div>
    );
  }
}

NewsletterSettings.propTypes = {
  extensionSettings: PropTypes.object,
  onExtensionSettingsUpdate: PropTypes.func,
};
