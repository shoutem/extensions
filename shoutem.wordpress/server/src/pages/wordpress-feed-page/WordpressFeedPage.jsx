import React, { Component, PropTypes } from 'react';
import _ from 'lodash';
import { updateShortcutSettings } from '@shoutem/redux-api-sdk';
import { clear, isBusy } from '@shoutem/redux-io';
import { connect } from 'react-redux';
import {
  FEED_ITEMS,
  navigateToUrl,
  getFeedItems,
  fetchWordPressPosts,
  validateWordPressUrl,
} from 'src/redux';
import { FeedUrlInput, FeedPreview } from 'src/components';
import { isFeedUrlInsecure } from 'src/services';
import './style.scss';

class WordPressFeedPage extends Component {
  constructor(props) {
    super(props);

    this.handleSaveUrl = this.handleSaveUrl.bind(this);
    this.handleFeedPreviewRemoveClick = this.handleFeedPreviewRemoveClick.bind(this);
  }

  componentWillMount() {
    this.checkData(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.checkData(nextProps, this.props);
  }

  checkData(nextProps, props = {}) {
    const { shortcut: nextShortcut } = nextProps;
    const { shortcut } = props;

    const feedUrl = _.get(shortcut, 'settings.feedUrl');
    const nextFeedUrl = _.get(nextShortcut, 'settings.feedUrl');

    if (feedUrl !== nextFeedUrl) {
      this.props.fetchWordPressPosts({
        feedUrl: nextFeedUrl,
        shortcutId: nextShortcut.id,
      });
    }
  }

  handleSaveUrl(feedUrl) {
    const { shortcut } = this.props;
    const { id: shortcutId } = shortcut;

    if (feedUrl && !isFeedUrlInsecure(feedUrl)) {
      return this.props.validateWordPressUrl({ feedUrl, shortcutId })
        .then(() => this.props.updateShortcutSettings(shortcut, { feedUrl }));
    }

    return this.props.updateShortcutSettings(shortcut, { feedUrl });
  }

  handleFeedPreviewRemoveClick() {
    this.handleSaveUrl('');
    this.props.clearFeedItems();
  }

  render() {
    const { shortcut, feedItems, navigateToUrl } = this.props;

    const feedUrl = _.get(shortcut, 'settings.feedUrl');
    const isFeedUrlEmpty = _.isEmpty(feedUrl);

    return (
      <div className="wordpress-feed-page">
        {isFeedUrlEmpty && (
          <FeedUrlInput
            inProgress={isBusy(feedItems)}
            onContinueClick={this.handleSaveUrl}
          />
        )}
        {!isFeedUrlEmpty && (
          <FeedPreview
            feedItems={feedItems}
            feedUrl={feedUrl}
            onLinkClick={navigateToUrl}
            onRemoveClick={this.handleFeedPreviewRemoveClick}
          />
        )}
      </div>
    );
  }
}

WordPressFeedPage.propTypes = {
  shortcut: PropTypes.object,
  feedItems: PropTypes.array,
  updateShortcutSettings: PropTypes.func,
  validateWordPressUrl: PropTypes.func,
  loadFeed: PropTypes.func,
  clearFeedItems: PropTypes.func,
  fetchWordPressPosts: PropTypes.func,
  navigateToUrl: PropTypes.func,
};

function mapStateToProps(state, ownProps) {
  const { extensionName, shortcutId } = ownProps;
  const feedItems = getFeedItems(state, extensionName, shortcutId);

  return {
    feedItems,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    updateShortcutSettings: (shortcut, settingsPatch) => (
      dispatch(updateShortcutSettings(shortcut, settingsPatch))
    ),
    clearFeedItems: () => dispatch(clear(FEED_ITEMS, 'feedItems')),
    fetchWordPressPosts: (params) => dispatch(fetchWordPressPosts(params)),
    validateWordPressUrl: (params) => dispatch(validateWordPressUrl(params)),
    navigateToUrl: (url) => dispatch(navigateToUrl(url)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(WordPressFeedPage);
