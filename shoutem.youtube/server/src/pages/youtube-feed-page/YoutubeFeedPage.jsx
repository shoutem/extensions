import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import autoBindReact from 'auto-bind/react';
import i18next from 'i18next';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { LoaderContainer } from '@shoutem/react-web-ui';
import {
  getExtension,
  getShortcut,
  updateShortcutSettings,
} from '@shoutem/redux-api-sdk';
import { clear, isBusy, isInitialized } from '@shoutem/redux-io';
import { FeedPreview, FeedUrlInput, NonPlaylistAlert } from '../../components';
import ext from '../../const';
import { FEED_ITEMS, getFeedItems, loadFeed } from '../../redux';
import {
  isPlaylistUrl,
  resolveYoutubeError,
  validateYoutubeUrl,
} from '../../services';
import LOCALIZATION from './localization';
import './style.scss';

export class YoutubeFeedPage extends PureComponent {
  constructor(props) {
    super(props);

    autoBindReact(this);

    const feedUrl = _.get(props.shortcut, 'settings.feedUrl');
    const apiKey = _.get(props.extension, 'settings.apiKey');
    const sort = _.get(props.shortcut, 'settings.sort', 'relevance');

    this.state = {
      error: null,
      apiKey,
      feedUrl,
      sort,
    };

    if (validateYoutubeUrl(feedUrl)) {
      this.fetchPosts(feedUrl);
    }
  }

  updateSettings(feedUrl, sort) {
    const { shortcut, updateShortcutSettings } = this.props;
    const settings = { feedUrl, sort };

    this.setState({
      error: '',
    });

    updateShortcutSettings(shortcut, settings).catch(err => {
      this.setState({ error: err });
    });
  }

  fetchPosts(feedUrl) {
    const { apiKey, sort } = this.state;
    const { shortcut, loadFeed } = this.props;

    if (!feedUrl || !apiKey || !shortcut || !validateYoutubeUrl(feedUrl)) {
      return;
    }

    loadFeed(feedUrl, apiKey, shortcut.id, sort).catch(error => {
      const youtubeError = resolveYoutubeError(error);

      if (youtubeError) {
        this.setState({ error: youtubeError });
        return;
      }

      this.setState({ error: i18next.t(LOCALIZATION.GENERIC_ERROR) });
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
      this.fetchPosts(feedUrl),
    );
  }

  render() {
    const { feedUrl, sort, error } = this.state;
    const { feedItems, shortcut } = this.props;

    const initialized = isInitialized(shortcut);
    const savedSort = _.get(shortcut, 'settings.sort');
    const isPlayListFeedUrl = isPlaylistUrl(feedUrl);
    const showNonPlaylistAlert = !!feedUrl && !isPlayListFeedUrl;

    return (
      <LoaderContainer isLoading={!initialized} className="youtube-feed-page">
        {showNonPlaylistAlert && <NonPlaylistAlert />}
        {_.isEmpty(feedUrl) && (
          <FeedUrlInput
            inProgress={isBusy(feedItems)}
            error={error}
            onContinueClick={this.handleFeedUrlInputContinueClick}
          />
        )}
        {!_.isEmpty(feedUrl) && (
          <FeedPreview
            feedUrl={feedUrl}
            feedItems={feedItems}
            savedSort={savedSort}
            selectedSort={sort}
            showDurationLabel={isPlayListFeedUrl}
            sortOptionsAvailable={!isPlayListFeedUrl}
            onRemoveClick={this.handleFeedPreviewRemoveClick}
            onSortChanged={this.handleSortChanged}
            onConfirmClick={this.handleSortConfirmedClick}
          />
        )}
        {!!error && <div className="error-text">{error}</div>}
      </LoaderContainer>
    );
  }
}

YoutubeFeedPage.propTypes = {
  clearFeedItems: PropTypes.func.isRequired,
  extension: PropTypes.object.isRequired,
  loadFeed: PropTypes.func.isRequired,
  shortcut: PropTypes.object.isRequired,
  updateShortcutSettings: PropTypes.func.isRequired,
  feedItems: PropTypes.array,
};

YoutubeFeedPage.defaultProps = {
  feedItems: [],
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

function mapDispatchToProps(dispatch) {
  return {
    updateShortcutSettings: (shortcut, settings) =>
      dispatch(updateShortcutSettings(shortcut, settings)),
    clearFeedItems: () => dispatch(clear(FEED_ITEMS, 'feedItems')),
    loadFeed: (url, apiKey, shortcutId, sort) =>
      dispatch(loadFeed(url, apiKey, shortcutId, sort)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(YoutubeFeedPage);
