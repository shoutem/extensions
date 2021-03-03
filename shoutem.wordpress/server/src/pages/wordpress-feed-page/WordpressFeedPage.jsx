import React, { Component } from 'react';
import autoBindReact from 'auto-bind/react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { updateShortcutSettings } from '@shoutem/redux-api-sdk';
import { clear, isBusy } from '@shoutem/redux-io';
import { FeedUrlInput, FeedPreview } from 'src/components';
import {
  FEED_ITEMS,
  navigateToUrl,
  getCategories,
  getFeedItems,
  fetchWordPressPosts,
  loadPosts,
} from 'src/redux';
import { isFeedUrlInsecure } from 'src/services';
import './style.scss';

class WordPressFeedPage extends Component {
  constructor(props) {
    super(props);

    autoBindReact(this);
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
    const {
      getCategories,
      loadPosts,
      shortcut,
      updateShortcutSettings,
    } = this.props;
    const { id: shortcutId } = shortcut;

    if (feedUrl && !isFeedUrlInsecure(feedUrl)) {
      return getCategories({ feedUrl, shortcutId })
        .then(categories => loadPosts({ feedUrl, shortcutId, categories }))
        .then(() => updateShortcutSettings(shortcut, { feedUrl }));
    }

    return updateShortcutSettings(shortcut, { feedUrl });
  }

  handleFeedPreviewRemoveClick() {
    const { clearFeedItems } = this.props;

    this.handleSaveUrl('');
    clearFeedItems();
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
  loadPosts: PropTypes.func,
  clearFeedItems: PropTypes.func,
  fetchWordPressPosts: PropTypes.func,
  navigateToUrl: PropTypes.func,
  getCategories: PropTypes.func,
};

function mapStateToProps(state, ownProps) {
  const { extensionName, shortcutId } = ownProps;
  const feedItems = getFeedItems(state, extensionName, shortcutId);

  return { feedItems };
}

function mapDispatchToProps(dispatch) {
  return {
    updateShortcutSettings: (shortcut, settingsPatch) =>
      dispatch(updateShortcutSettings(shortcut, settingsPatch)),
    clearFeedItems: () => dispatch(clear(FEED_ITEMS, 'feedItems')),
    fetchWordPressPosts: params => dispatch(fetchWordPressPosts(params)),
    loadPosts: params => dispatch(loadPosts(params)),
    navigateToUrl: url => dispatch(navigateToUrl(url)),
    getCategories: params => dispatch(getCategories(params)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(WordPressFeedPage);
