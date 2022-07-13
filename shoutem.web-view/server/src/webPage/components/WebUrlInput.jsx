/* eslint-disable react-native/no-raw-text */
import React, { useState } from 'react';
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

export default function WebUrlInput({ onContinueClick }) {
  const [url, setUrl] = useState('');
  const [error, setError] = useState(null);

  function getValidationState() {
    return error ? 'error' : false;
  }

  function handleTextChange(event) {
    setUrl(event.target.value);
    setError(null);
  }

  function handleContinue() {
    const trimmedUrl = _.trim(url);

    if (validateUrl(trimmedUrl)) {
      onContinueClick(trimmedUrl);
    } else {
      setError({ error: i18next.t(LOCALIZATION.INVALID_URL) });
    }
  }

  return (
    <>
      <FormGroup validationState={getValidationState()}>
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
            requiring user to log in. If user is not logged in, user specific
            URL parts might not be parsed as inteded. To protect your screen, go{' '}
            <br />
            to Settings &gt; Users &gt; Protected screens.
          </Trans>
        </Alert>
        <ControlLabel>{i18next.t(LOCALIZATION.FORM_WEBSITE_URL)}</ControlLabel>
        <FormControl
          type="text"
          className="form-control"
          onChange={handleTextChange}
        />
        <HelpBlock className="text-error">{error}</HelpBlock>
      </FormGroup>
      <ButtonToolbar>
        <Button bsStyle="primary" disabled={!url} onClick={handleContinue}>
          {i18next.t(LOCALIZATION.BUTTON_CONTINUE)}
        </Button>
      </ButtonToolbar>
    </>
  );
}

WebUrlInput.propTypes = {
  onContinueClick: PropTypes.func.isRequired,
};
