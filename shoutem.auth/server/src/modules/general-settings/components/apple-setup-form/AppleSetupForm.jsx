import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ControlLabel, Col, Row } from 'react-bootstrap';
import autoBindReact from 'auto-bind';
import { Switch, FontIcon, FontIconPopover } from '@shoutem/react-web-ui';
import _ from 'lodash';
import MessageWithLink from '../../../../components/message-with-link';
import './style.scss';

const learnMoreText = 'Learn more.';
const supportArticleLink =
  'https://www.shoutem.com/support/sign-in-with-apple/';
const appleSignInMessage =
  'You need to leave Apple Sign In enabled if you use Social sign in on iOS app.';

const appleButtonStyleMessage = 'Change Apple Sign In button style.';
const darkButtonTooltipMessage = 'Apple Sign In button can be dark or light';
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
        <ControlLabel>Apple</ControlLabel>
        <FontIconPopover
          delayHide={2000}
          hideOnMouseLeave={false}
          message={
            <MessageWithLink
              message={darkButtonTooltipMessage}
              link={appleButtonStyleLink}
              linkText={learnMoreText}
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
            <h3>Apple Authentication setup</h3>
            <ControlLabel>{appleButtonStyleMessage}</ControlLabel>
            <Row>
              <Col xs={6}>
                <ControlLabel>
                  Dark Button Style
                  <FontIconPopover
                    delayHide={2000}
                    hideOnMouseLeave={false}
                    message={
                      <MessageWithLink
                        message={darkButtonTooltipMessage}
                        link={appleButtonStyleLink}
                        linkText={learnMoreText}
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
