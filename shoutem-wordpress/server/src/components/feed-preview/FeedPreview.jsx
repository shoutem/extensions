import React, { PropTypes } from 'react';
import { FormGroup, ControlLabel } from 'react-bootstrap';
import URI from 'urijs';
import _ from 'lodash';
import { FontIcon } from '@shoutem/react-web-ui';
import FeedPreviewTable from '../feed-preview-table';
import './style.scss';

const isUnsecureFeed = (feedUrl) => {
  if (!feedUrl) {
    return false;
  }

  const feedUri = new URI(feedUrl);
  const feedProtocol = feedUri.protocol();
  return feedProtocol !== 'https';
}

//eslint-disable-next-line max-len
const tutorialLink = 'https://pearsonnacommunity.force.com/support/s/article/ka6d00000019KVGAA2/How-to-display-mixed-content-with-Google-Chrome-Internet-Explorer-or-Firefox-1408394589290';

export default class FeedPreview extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.handleLinkClick = this.handleLinkClick.bind(this);
  }

  handleLinkClick(e) {
    const { onLinkClick } = this.props;
    const url = e.target.getAttribute('href');

    return onLinkClick(url);
  }

  renderMixedContentWarning() {
    const { feedUrl, onRemoveClick, feedItems } = this.props;

    const showMixedContentWarning = isUnsecureFeed(feedUrl) && _.isEmpty(feedItems);

    if (!showMixedContentWarning) {
      return null;
    }

    return (
      <ControlLabel>
        You are trying to load a feed from 'http'. Change feed's protocol to 'https' or learn{' '}
        <a href={tutorialLink} target="_top" onClick={this.handleLinkClick}>
          here
        </a>
        {' '}how to allow your browser to load it.
      </ControlLabel>
    );
  }

  render() {
    const { feedUrl, onRemoveClick, feedItems } = this.props;

    return (
      <div className="feed-preview">
        <form>
          <FormGroup className="feed-preview__container">
            <ControlLabel>Wordpress page URL</ControlLabel>
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
                size="large"
                onClick={onRemoveClick}
              />
            </div>
          </FormGroup>
        </form>
        {this.renderMixedContentWarning()}
        <FeedPreviewTable
          feedItems={feedItems}
        />
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
