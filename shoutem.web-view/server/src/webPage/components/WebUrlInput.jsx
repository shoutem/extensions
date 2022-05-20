/* eslint-disable react-native/no-raw-text */
import React, { Component } from 'react';
import {
  Alert,
  Button,
  ButtonToolbar,
  ControlLabel,
  FormControl,
  FormGroup,
  HelpBlock,
} from 'react-bootstrap';
import { Trans } from 'react-i18next';
import i18next from 'i18next';
import _ from 'lodash';
import PropTypes from 'prop-types';
import validator from 'validator';
import LOCALIZATION from './localization';
import './style.scss';

const validateUrl = url => validator.isURL(url, { require_protocol: false });

export default class WebUrlInput extends Component {
  constructor(props) {
    super(props);
    this.handleTextChange = this.handleTextChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleContinue = this.handleContinue.bind(this);
    this.getValidationState = this.getValidationState.bind(this);

    this.state = {
      url: '',
      error: null,
    };
  }

  getValidationState() {
    return this.state.error ? 'error' : false;
  }

  handleTextChange(event) {
    this.setState({
      url: event.target.value,
      error: null,
    });
  }

  handleSubmit(event) {
    event.preventDefault();
    if (this.state.url) {
      this.handleContinue();
    }
  }

  handleContinue() {
    const url = _.trim(this.state.url);
    if (validateUrl(url)) {
      this.props.onContinueClick(url);
    } else {
      this.setState({ error: i18next.t(LOCALIZATION.INVALID_URL) });
    }
  }

  render() {
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <FormGroup validationState={this.getValidationState()}>
            <Alert className="web-url-input__alert">
              <Trans i18nKey={LOCALIZATION.GENERIC_URLS_ALERT_MESSAGE}>
                We support defining user custom URLs. To defineit, wrap user
                constants inside double curly brackets, like so:
                <br />
                <i>
                  https://www.example.com/&#123;&#123;profile.nick&#125;&#125;?id=&#123;&#123;id&#125;&#125;
                </i>
                <br />
                <br />
                When defining user custom URLs, consider protecting the screen -
                requiring user to log in. If user is not logged in, user
                specific URL parts might not be parsed as inteded. To protect
                your screen, go <br />
                to Settings &gt; Users &gt; Protected screens.
              </Trans>
            </Alert>
            <ControlLabel>
              {i18next.t(LOCALIZATION.FORM_WEBSITE_URL)}
            </ControlLabel>
            <FormControl
              type="text"
              className="form-control"
              onChange={this.handleTextChange}
            />
            <HelpBlock className="text-error">{this.state.error}</HelpBlock>
          </FormGroup>
        </form>
        <ButtonToolbar>
          <Button
            bsStyle="primary"
            disabled={!this.state.url}
            onClick={this.handleContinue}
          >
            {i18next.t(LOCALIZATION.BUTTON_CONTINUE)}
          </Button>
        </ButtonToolbar>
      </div>
    );
  }
}

WebUrlInput.propTypes = {
  onContinueClick: PropTypes.func,
};
