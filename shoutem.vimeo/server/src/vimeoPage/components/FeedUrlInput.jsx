import _ from 'lodash';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import i18next from 'i18next';
import {
  Button,
  ButtonToolbar,
  FormGroup,
  ControlLabel,
  FormControl,
  HelpBlock,
} from 'react-bootstrap';
import { LoaderContainer } from '@shoutem/react-web-ui';
import validator from 'validator';
import LOCALIZATION from './localization';
import './style.scss';

const isValidUrl = url => validator.isURL(url, { require_protocol: false });

function isValidVimeoUrl(url) {
  if (!isValidUrl(url)) {
    return false;
  }
  if (!/vimeo/i.test(url)) {
    return false;
  }
  return true;
}

const resolveFeedUrl = feedUrl => {
  const trimmedUrl = _.trim(feedUrl);
  return _.trimEnd(trimmedUrl, '/');
};

export default class FeedUrlInput extends Component {
  constructor(props) {
    super(props);
    this.handleTextChange = this.handleTextChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleContinue = this.handleContinue.bind(this);
    this.getValidationState = this.getValidationState.bind(this);

    this.state = {
      feedUrl: '',
      error: props.error,
    };
  }

  componentWillReceiveProps(newProps) {
    this.setState({ error: newProps.error });
  }

  getValidationState() {
    return this.state.error ? 'error' : null;
  }

  handleTextChange(event) {
    this.setState({
      feedUrl: event.target.value,
      error: null,
    });
  }

  handleSubmit(event) {
    event.preventDefault();
    if (this.state.feedUrl) {
      this.handleContinue();
    }
  }

  handleContinue() {
    const { feedUrl } = this.state;
    const { onContinueClick } = this.props;

    const feedUrlChannel = `${resolveFeedUrl(feedUrl)}/videos/rss`;

    if (isValidVimeoUrl(feedUrlChannel)) {
      onContinueClick(feedUrlChannel);
      return;
    }

    const feedUrlUsername = `https://vimeo.com/${feedUrlChannel}`;

    if (isValidVimeoUrl(feedUrlUsername)) {
      onContinueClick(feedUrlUsername);
      return;
    }
    this.setState({ error: i18next.t(LOCALIZATION.INVALID_URL) });
  }

  render() {
    const { feedUrl, error } = this.state;
    const { inProgress } = this.props;

    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <FormGroup validationState={this.getValidationState()}>
            <ControlLabel>{i18next.t(LOCALIZATION.ENTER_LINK)}</ControlLabel>
            <FormControl
              type="text"
              className="form-control"
              onChange={this.handleTextChange}
            />
            <HelpBlock className="text-error">{error}</HelpBlock>
          </FormGroup>
        </form>
        <ButtonToolbar>
          <Button
            bsStyle="primary"
            disabled={!feedUrl}
            onClick={this.handleContinue}
          >
            <LoaderContainer isLoading={inProgress}>
              {i18next.t(LOCALIZATION.CONTINUE_BUTTON)}
            </LoaderContainer>
          </Button>
        </ButtonToolbar>
      </div>
    );
  }
}

FeedUrlInput.propTypes = {
  inProgress: PropTypes.bool,
  onContinueClick: PropTypes.func,
  error: PropTypes.string,
};

FeedUrlInput.defaultProps = {
  inProgress: false,
};
