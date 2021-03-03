import React, { Component } from 'react';
import autoBindReact from 'auto-bind/react';
import i18next from 'i18next';
import _ from 'lodash';
import PropTypes from 'prop-types';
import {
  Button,
  ButtonToolbar,
  FormGroup,
  ControlLabel,
  FormControl,
  HelpBlock,
} from 'react-bootstrap';
import { LoaderContainer } from '@shoutem/react-web-ui';
import { validateWordPressUrl } from 'src/services';
import LOCALIZATION from './localization';
import './style.scss';

export default class FeedUrlInput extends Component {
  constructor(props) {
    super(props);

    autoBindReact(this);

    const { feedUrl } = props;

    this.state = {
      feedUrl,
      inProgress: false,
      error: null,
    };
  }

  updateFeedUrl(feedUrl) {
    this.setState({ inProgress: true });

    this.props
      .onContinueClick(feedUrl)
      .then(() => this.setState({ inProgress: false }))
      .catch(error => {
        // eslint-disable-next-line no-console
        console.error('Failed to update feed URL:\n', error);
        this.setState({
          inProgress: false,
          error: i18next.t(LOCALIZATION.NOT_WORDPRESS_URL),
        });
      });
  }

  handleContinueClick() {
    const feedUrl = _.trim(this.state.feedUrl, '/ ');
    const feedUrlValid = validateWordPressUrl(feedUrl);

    if (!feedUrlValid) {
      this.setState({ error: i18next.t(LOCALIZATION.INVALID_URL) });
      return;
    }

    this.updateFeedUrl(feedUrl);
  }

  handleTextChange(event) {
    const feedUrl = event.target.value;
    this.setState({ feedUrl, error: null });
  }

  handleSubmit(event) {
    event.preventDefault();

    if (this.state.feedUrl) {
      this.handleContinueClick();
    }
  }

  render() {
    const { inProgress, error, feedUrl } = this.state;
    const validationState = error ? 'error' : 'success';

    return (
      <div className="feed-url-input">
        <form onSubmit={this.handleSubmit}>
          <FormGroup validationState={validationState}>
            <ControlLabel>{i18next.t(LOCALIZATION.PAGE_URL)}</ControlLabel>
            <FormControl
              className="form-control"
              onChange={this.handleTextChange}
              type="text"
              value={feedUrl}
            />
            {error && (
              <div className="has-error">
                <HelpBlock>{error}</HelpBlock>
              </div>
            )}
          </FormGroup>
        </form>
        <ControlLabel>
          {i18next.t(LOCALIZATION.WORDPRESS_VERSION_WARNING)}
        </ControlLabel>
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
  onContinueClick: PropTypes.func,
};
