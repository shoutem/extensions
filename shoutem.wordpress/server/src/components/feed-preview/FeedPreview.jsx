import React, { Component, PropTypes } from 'react';
import { FormGroup, ControlLabel } from 'react-bootstrap';
import _ from 'lodash';
import { FontIcon } from '@shoutem/react-web-ui';
import { isFeedUrlInsecure } from 'src/services';
import FeedPreviewTable from '../feed-preview-table';
import './style.scss';

// eslint-disable-next-line max-len
const TUTORIAL_LINK = 'https://pearsonnacommunity.force.com/support/s/article/ka6d00000019KVGAA2/How-to-display-mixed-content-with-Google-Chrome-Internet-Explorer-or-Firefox-1408394589290';

export default class FeedPreview extends Component {
  constructor(props, context) {
    super(props, context);

    this.handleLinkClick = this.handleLinkClick.bind(this);
  }

  handleLinkClick(event) {
    event.preventDefault();
    return this.props.onLinkClick(TUTORIAL_LINK);
  }

  renderInsecureFeedWarning() {
    return (
      <ControlLabel className="feed-preview__insecure-warning">
        You are trying to load a feed from 'http'. Change feed's protocol to 'https' or learn
        <button className="btn-textual" onClick={this.handleLinkClick} target="_top">
          {' '}here{' '}
        </button>
        how to allow your browser to load it.
      </ControlLabel>
    );
  }

  render() {
    const { feedUrl, onRemoveClick, feedItems } = this.props;

    const showMixedContentWarning = isFeedUrlInsecure(feedUrl);
    const showPreviewTable = !_.isEmpty(feedItems) || !showMixedContentWarning;

    return (
      <div className="feed-preview">
        <form>
          <FormGroup className="feed-preview__container">
            <ControlLabel>WordPress page URL</ControlLabel>
            <div className="feed-preview__feed-url-container">
              <div />
              <div className="feed-preview__feed-url-text-wrapper text-ellipsis">
                <span className="feed-preview__feed-url">
                  {feedUrl}
                </span>
              </div>
              <FontIcon
                className="feed-preview__remove"
                name="close"
                onClick={onRemoveClick}
                size="large"
              />
            </div>
          </FormGroup>
        </form>
        {showMixedContentWarning && this.renderInsecureFeedWarning()}
        {showPreviewTable && <FeedPreviewTable feedItems={feedItems} />}
      </div>
    );
  }
}

FeedPreview.defaultProps = {
  onLinkClick: _.noop,
};

FeedPreview.propTypes = {
  feedUrl: PropTypes.string,
  feedItems: PropTypes.array,
  onRemoveClick: PropTypes.func,
  onLinkClick: PropTypes.func,
};
