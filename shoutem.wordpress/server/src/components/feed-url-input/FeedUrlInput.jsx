import _ from 'lodash';
import React, { Component, PropTypes } from 'react';
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
import './style.scss';

export default class FeedUrlInput extends Component {
  constructor(props) {
    super(props);

    this.handleTextChange = this.handleTextChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleContinueClick = this.handleContinueClick.bind(this);
    this.updateFeedUrl = this.updateFeedUrl.bind(this);

    const { feedUrl } = props;

    this.state = {
      feedUrl,
      inProgress: false,
      error: null,
    };
  }

  updateFeedUrl(feedUrl) {
    this.setState({ inProgress: true });

    this.props.onContinueClick(feedUrl)
      .then(() => this.setState({ inProgress: false }))
      .catch(() => (
        this.setState({
          inProgress: false,
          error: 'Provided URL is not a valid WordPress URL.',
        })
      ));
  }

  handleContinueClick() {
    const feedUrl = _.trim(this.state.feedUrl, '/ ');
    const feedUrlValid = validateWordPressUrl(feedUrl);

    if (!feedUrlValid) {
      this.setState({ error: 'Invalid URL.' });
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
            <ControlLabel>
              WordPress page URL
            </ControlLabel>
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
          WordPress versions 4.4 or newer. In case your site is using WordPress version 4.4 to 4.7,
          you will need to install a plugin in order to fetch posts. For WordPress version 4.7 and
          above it is going to work out of the box.
          If you are using an older version of WordPress, you will need to update it.
        </ControlLabel>
        <ButtonToolbar>
          <Button
            bsStyle="primary"
            disabled={!feedUrl}
            onClick={this.handleContinueClick}
          >
            <LoaderContainer isLoading={inProgress}>
              Continue
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
