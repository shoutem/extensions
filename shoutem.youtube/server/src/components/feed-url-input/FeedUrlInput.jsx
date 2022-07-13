import React, { Component } from 'react';
import {
  Button,
  ButtonToolbar,
  ControlLabel,
  FormControl,
  FormGroup,
} from 'react-bootstrap';
import autoBindReact from 'auto-bind/react';
import i18next from 'i18next';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { LoaderContainer } from '@shoutem/react-web-ui';
import { validateYoutubeUrl } from '../../services/youtube';
import { FeedUrlDescription } from '../feed-url-description';
import LOCALIZATION from './localization';
import './style.scss';

export default class FeedUrlInput extends Component {
  constructor(props) {
    super(props);

    autoBindReact(this);

    this.state = {
      feedUrl: '',
      error: props.error,
    };
  }

  getValidationState() {
    const { error } = this.state;

    return error ? 'error' : 'success';
  }

  handleContinueClick() {
    const { onContinueClick } = this.props;
    const { feedUrl } = this.state;
    const feedUrlTrimmed = _.trim(feedUrl);

    if (!validateYoutubeUrl(feedUrlTrimmed)) {
      this.setState({
        error: i18next.t(LOCALIZATION.TOOLTIP_LABEL),
      });
    } else {
      onContinueClick(feedUrlTrimmed);
    }
  }

  handleTextChange(event) {
    this.setState({
      feedUrl: event.target.value,
      error: null,
    });
  }

  handleSubmit(event) {
    event.preventDefault();
    this.handleContinueClick();
  }

  handleTextChangeError() {
    const { error } = this.state;

    if (!error) {
      return null;
    }
    return (
      <ControlLabel className="text-error feed-url-input__error">
        {error}
      </ControlLabel>
    );
  }

  render() {
    const { feedUrl } = this.state;
    const { inProgress } = this.props;

    return (
      <div className="feed-url-input">
        <form onSubmit={this.handleSubmit}>
          <FormGroup validationState={this.getValidationState()}>
            <ControlLabel>{i18next.t(LOCALIZATION.INPUT_TITLE)}</ControlLabel>
            <FormControl
              type="text"
              className="form-control"
              value={feedUrl}
              onChange={this.handleTextChange}
            />
          </FormGroup>
        </form>
        {this.handleTextChangeError()}
        <FeedUrlDescription />
        <ButtonToolbar>
          <Button
            bsStyle="primary"
            disabled={!feedUrl}
            onClick={this.handleContinueClick}
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
  onContinueClick: PropTypes.func.isRequired,
  error: PropTypes.string,
  inProgress: PropTypes.bool,
};

FeedUrlInput.defaultProps = {
  error: null,
  inProgress: false,
};
