import React, { Component } from 'react';
import autoBindReact from 'auto-bind/react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { LoaderContainer } from '@shoutem/react-web-ui';
import {
  fetchShortcut,
  updateShortcutSettings,
  getShortcut,
  fetchExtension,
  getExtension,
} from '@shoutem/redux-api-sdk';
import { isBusy, clear, isInitialized } from '@shoutem/redux-io';
import { FeedPreview, FeedUrlInput } from '../../components';
import { validateYoutubeUrl, isPlaylistUrl } from '../../services/youtube';
import ext from '../../const';
import { FEED_ITEMS, loadFeed, getFeedItems } from '../../redux';
import './style.scss';

const ACTIVE_SCREEN_INPUT = 0;
const ACTIVE_SCREEN_PREVIEW = 1;

export class YoutubeFeedPage extends Component {
  constructor(props) {
    super(props);

    autoBindReact(this);

    const feedUrl = _.get(props.shortcut, 'settings.feedUrl');
    const apiKey = _.get(props.extension, 'settings.apiKey');
    const sort = _.get(props.shortcut, 'settings.sort', 'relevance');

    this.state = {
      error: null,
      hasChanges: false,
      apiKey,
      feedUrl,
      sort,
    };

    if (validateYoutubeUrl(feedUrl)) {
      this.fetchPosts(feedUrl, sort);
    }
  }

  componentWillReceiveProps(nextProps) {
    const { shortcut: nextShortcut } = nextProps;
    const { extension: nextExtension } = nextProps;
    const { feedUrl } = this.state;

    // Must be check with "undefined" because _.isEmpty() will validate this clause
    // when feedUrl === null which is set when we want to clear { feedUrl } and this causes feedUrl
    // to be set even when user removed it.
    if (feedUrl === undefined) {
      const nextFeedUrl = _.get(nextShortcut, 'settings.feedUrl');
      const nextApiKey = _.get(nextExtension, 'settings.apiKey');

      this.setState({
        feedUrl: nextFeedUrl,
        apiKey: nextApiKey,
      });

      if (nextFeedUrl && validateYoutubeUrl(nextFeedUrl)) {
        nextProps.loadFeed(nextFeedUrl, nextApiKey, nextShortcut.id);
      }
    }
  }

  getActiveScreen() {
    const { feedUrl } = this.state;

    if (!_.isEmpty(feedUrl)) {
      return ACTIVE_SCREEN_PREVIEW;
    }

    return ACTIVE_SCREEN_INPUT;
  }

  updateSettings(feedUrl, sort) {
    const { shortcut, updateShortcutSettings } = this.props;
    const settings = { feedUrl, sort };

    this.setState({ error: '', inProgress: true });
    updateShortcutSettings(shortcut, settings)
      .then(() => {
        this.setState({ hasChanges: false, inProgress: false });
      })
      .catch(err => {
        this.setState({ error: err, inProgress: false });
      });
  }

  fetchPosts(feedUrl, sort) {
    const { apiKey } = this.state;
    const { shortcut, loadFeed } = this.props;

    if (!feedUrl || !apiKey || !shortcut) {
      return;
    }

    loadFeed(feedUrl, apiKey, shortcut.id, sort).catch(err => {
      this.setState({
        error: _.get(err, 'message'),
        inProgress: false,
      });
    });
  }

  handleFeedUrlInputContinueClick(feedUrl) {
    this.setState({
      feedUrl,
    });
    this.updateSettings(feedUrl);
    this.fetchPosts(feedUrl);
  }

  handleFeedPreviewRemoveClick() {
    const { clearFeedItems } = this.props;

    const sort = 'relevance';

    this.setState({
      feedUrl: null,
      sort,
    });

    this.updateSettings(null, sort);
    clearFeedItems();
  }

  handleSortChanged(sort) {
    this.setState({
      sort,
    });
  }

  handleSortConfirmedClick() {
    const { shortcut, updateShortcutSettings } = this.props;
    const { feedUrl, sort } = this.state;
    const settings = { feedUrl, sort };

    updateShortcutSettings(shortcut, settings).then(() =>
      this.fetchPosts(feedUrl, sort),
    );
  }

  render() {
    const { feedUrl, sort, error } = this.state;
    const { feedItems, shortcut } = this.props;

    const activeScreen = this.getActiveScreen();
    const initialized = isInitialized(shortcut);
    const savedSort = _.get(shortcut, 'settings.sort');
    const sortOptionsAvailable = !isPlaylistUrl(feedUrl);

    return (
      <LoaderContainer isLoading={!initialized} className="youtube-feed-page">
        {activeScreen === ACTIVE_SCREEN_INPUT && (
          <FeedUrlInput
            inProgress={isBusy(feedItems)}
            error={error}
            onContinueClick={this.handleFeedUrlInputContinueClick}
          />
        )}
        {activeScreen === ACTIVE_SCREEN_PREVIEW && (
          <FeedPreview
            feedUrl={feedUrl}
            feedItems={feedItems}
            onRemoveClick={this.handleFeedPreviewRemoveClick}
            selectedSort={sort}
            savedSort={savedSort}
            onSortChanged={this.handleSortChanged}
            onConfirmClick={this.handleSortConfirmedClick}
            sortOptionsAvailable={sortOptionsAvailable}
          />
        )}
      </LoaderContainer>
    );
  }
}

YoutubeFeedPage.propTypes = {
  shortcut: PropTypes.object,
  extension: PropTypes.object,
  feedItems: PropTypes.array,
  fetchExtension: PropTypes.func,
  fetchShortcut: PropTypes.func,
  updateShortcutSettings: PropTypes.func,
  loadFeed: PropTypes.func,
  clearFeedItems: PropTypes.func,
};

function mapStateToProps(state, ownProps) {
  const { shortcutId } = ownProps;
  const extensionName = ext();

  return {
    extension: getExtension(state, extensionName),
    shortcut: getShortcut(state, shortcutId),
    feedItems: getFeedItems(state, extensionName, shortcutId),
  };
}

function mapDispatchToProps(dispatch, ownProps) {
  const { shortcutId } = ownProps;

  return {
    fetchExtension: () => dispatch(fetchExtension(ext())),
    fetchShortcut: () => dispatch(fetchShortcut(shortcutId)),
    updateShortcutSettings: (shortcut, settings) =>
      dispatch(updateShortcutSettings(shortcut, settings)),
    clearFeedItems: () => dispatch(clear(FEED_ITEMS, 'feedItems')),
    loadFeed: (url, apiKey, shortcutId, sort) =>
      dispatch(loadFeed(url, apiKey, shortcutId, sort)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(YoutubeFeedPage);
