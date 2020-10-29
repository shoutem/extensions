import _ from 'lodash';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import autoBindReact from 'auto-bind/react';
import i18next from 'i18next';
import {
  Button,
  ButtonToolbar,
  FormGroup,
  ControlLabel,
  FormControl,
} from 'react-bootstrap';
import { LoaderContainer } from '@shoutem/react-web-ui';
import { validateYoutubeUrl } from '../../services/youtube';
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
    return this.state.error ? 'error' : 'success';
  }

  handleContinueClick() {
    const feedUrl = _.trim(this.state.feedUrl);
    if (!validateYoutubeUrl(feedUrl)) {
      this.setState({
        error: i18next.t(LOCALIZATION.TOOLTIP_LABEL),
      });
    } else {
      this.props.onContinueClick(feedUrl);
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
      return (
        <ControlLabel>
          {i18next.t(LOCALIZATION.TOOLTIP_LABEL)}
        </ControlLabel>
      );
    }
    return (<ControlLabel className="text-error feed-url-input__error">
      {error}
    </ControlLabel>);
  }

  render() {
    return (
      <div className="feed-url-input">
        <form onSubmit={this.handleSubmit}>
          <FormGroup validationState={this.getValidationState()}>
            <ControlLabel>{i18next.t(LOCALIZATION.INPUT_TITLE)}</ControlLabel>
            <FormControl
              type="text"
              className="form-control"
              value={this.state.feedUrl}
              onChange={this.handleTextChange}
            />
          </FormGroup>
        </form>
        {this.handleTextChangeError()}
        <ButtonToolbar>
          <Button
            bsStyle="primary"
            disabled={!this.state.feedUrl}
            onClick={this.handleContinueClick}
          >
            <LoaderContainer isLoading={this.props.inProgress}>
              {i18next.t(LOCALIZATION.CONTINUE_BUTTON)}
            </LoaderContainer>
          </Button>
        </ButtonToolbar>
      </div>
    );
  }
}

FeedUrlInput.propTypes = {
  onContinueClick: PropTypes.func,
  error: PropTypes.string,
  inProgress: PropTypes.bool,
};

FeedUrlInput.defaultProps = {
  inProgress: false,
};
