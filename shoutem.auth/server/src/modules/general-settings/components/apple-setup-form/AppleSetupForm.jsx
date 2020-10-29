import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ControlLabel, Col, Row } from 'react-bootstrap';
import autoBindReact from 'auto-bind/react';
import i18next from 'i18next';
import { Switch, FontIcon, FontIconPopover } from '@shoutem/react-web-ui';
import _ from 'lodash';
import MessageWithLink from '../../../../components/message-with-link';
import LOCALIZATION from './localization';
import './style.scss';

const supportArticleLink =
  'https://www.shoutem.com/support/sign-in-with-apple/';
const appleButtonStyleLink =
  'https://developer.apple.com/design/human-interface-guidelines/sign-in-with-apple/overview/buttons/';

export default class AppleSetupForm extends Component {
  constructor(props) {
    super(props);
    autoBindReact(this);
  }

  handleButtonStyleEnabledToggle() {
    const { providerSettings, onSetupUpdate } = this.props;
    const enabled = _.get(providerSettings, 'buttonDarkModeStyle', false);

    const settingsPatch = {
      providers: {
        apple: { buttonDarkModeStyle: !enabled },
      },
    };

    onSetupUpdate(settingsPatch);
  }

  handleAppleEnabledToggle() {
    const { onSetupUpdate, providerSettings, changeAppleClientID } = this.props;
    const enabled = _.get(providerSettings, 'enabled', false);

    const settingsPatch = {
      providers: {
        apple: { enabled: !enabled },
      },
    };

    if (!enabled) {
      changeAppleClientID();
    }

    onSetupUpdate(settingsPatch);
  }

  render() {
    const { providerSettings, className } = this.props;
    const { enabled, buttonDarkModeStyle } = providerSettings;

    return (
      <div className={className}>
        <ControlLabel>{i18next.t(LOCALIZATION.FORM_APPLE_TITLE)}</ControlLabel>
        <FontIconPopover
          delayHide={2000}
          hideOnMouseLeave={false}
          message={
            <MessageWithLink
              link={supportArticleLink}
              linkText={i18next.t(LOCALIZATION.LEARN_MORE_MESSAGE)}
              message={i18next.t(LOCALIZATION.APPLE_SIGN_IN_MESSAGE)}
            />
          }
        >
          <FontIcon
            className="general-settings__icon-popover"
            name="info"
            size="24px"
          />
        </FontIconPopover>
        <Switch onChange={this.handleAppleEnabledToggle} value={enabled} />
        {enabled && (
          <div className="apple-setup-form">
            <h3>{i18next.t(LOCALIZATION.TITLE)}</h3>
            <ControlLabel>
              {i18next.t(LOCALIZATION.FORM_APPLE_BUTTON_STYLE_TITLE)}
            </ControlLabel>
            <Row>
              <Col xs={6}>
                <ControlLabel>
                  {i18next.t(LOCALIZATION.FORM_DARK_BUTTON_TITLE)}
                  <FontIconPopover
                    delayHide={2000}
                    hideOnMouseLeave={false}
                    message={
                      <MessageWithLink
                        link={appleButtonStyleLink}
                        linkText={i18next.t(LOCALIZATION.LEARN_MORE_MESSAGE)}
                        message={i18next.t(
                          LOCALIZATION.DARK_BUTTON_TOOLTIP_MESSAGE,
                        )}
                      />
                    }
                  >
                    <FontIcon
                      className="general-settings__icon-popover"
                      name="info"
                      size="24px"
                    />
                  </FontIconPopover>
                </ControlLabel>
              </Col>
              <Col xs={6}>
                <Switch
                  onChange={this.handleButtonStyleEnabledToggle}
                  value={buttonDarkModeStyle}
                />
              </Col>
            </Row>
          </div>
        )}
      </div>
    );
  }
}

AppleSetupForm.propTypes = {
  onSetupUpdate: PropTypes.func,
  changeAppleClientID: PropTypes.func,
  providerSettings: PropTypes.object,
  className: PropTypes.string,
};
