import React from 'react';
import { connect } from 'react-redux';
import autoBindReact from 'auto-bind/react';
import _ from 'lodash';
import { cloneStatus, getMeta } from '@shoutem/redux-io';
import { connectStyle } from '@shoutem/theme';
import { updateAudioPlayerBannerShown as updateAudioPlayerBannerAction } from 'shoutem.audio';
import { getRouteParams, navigateTo } from 'shoutem.navigation';
import { RssListScreen } from 'shoutem.rss';
import {
  ContinuePlayingButton,
  FeaturedEpisodeView,
  ListEpisodeView,
} from '../components';
import { EPISODES_COLLECTION_TAG, ext, RSS_PODCAST_SCHEMA } from '../const';
import {
  addDownloadedEpisode,
  getEpisodesFeed,
  getEpisodesFeedWithDownloads,
  removeDownloadedEpisode,
} from '../redux';

export class EpisodesListScreen extends RssListScreen {
  constructor(props, context) {
    super(props, context);

    autoBindReact(this);

    this.state = {
      ...this.state,
      schema: RSS_PODCAST_SCHEMA,
      tag: EPISODES_COLLECTION_TAG,
    };
  }

  openEpisodeWithId(id) {
    const { data, feedUrl, enableDownload, shortcutTitle } = this.props;

    const episode = _.find(data, { id });
    const meta = getMeta(data);

    navigateTo(ext('EpisodeDetailsScreen'), {
      id,
      feedUrl,
      enableDownload,
      meta,
      shortcutTitle,
      analyticsPayload: {
        itemId: id,
        itemName: episode.title,
      },
    });
  }

  getNextEpisode(episode) {
    const { data } = this.props;

    const currentEpisodeIndex = _.findIndex(data, { id: episode.id });

    return data[currentEpisodeIndex + 1];
  }

  renderFeaturedItem(episode) {
    const { enableDownload, feedUrl, data } = this.props;
    const { screenSettings } = getRouteParams(this.props);

    return screenSettings.hasFeaturedItem && episode ? (
      <FeaturedEpisodeView
        key={episode.id}
        feedUrl={feedUrl}
        enableDownload={enableDownload}
        episode={episode}
        onPress={this.openEpisodeWithId}
        meta={getMeta(data)}
      />
    ) : null;
  }

  renderRow(episode) {
    const { enableDownload, feedUrl, data } = this.props;

    return (
      <ListEpisodeView
        key={episode.id}
        enableDownload={enableDownload}
        episode={episode}
        feedUrl={feedUrl}
        onPress={this.openEpisodeWithId}
        meta={getMeta(data)}
      />
    );
  }

  renderFooter() {
    const { feedUrl, shortcutTitle } = this.props;

    const playlist = {
      id: feedUrl,
      title: shortcutTitle,
    };

    return <ContinuePlayingButton playlist={playlist} />;
  }
}

export const mapStateToProps = (state, ownProps) => {
  const { shortcut } = getRouteParams(ownProps);
  const shortcutId = shortcut?.id || null;
  const settings = shortcut?.settings || {};
  const {
    feedUrl,
    enableDownload = false,
    isInAppContentSearchEnabled: isSearchSettingEnabled = false,
  } = settings;
  const episodesFeed = getEpisodesFeed(state, feedUrl);
  const resolvedFeed = enableDownload
    ? getEpisodesFeedWithDownloads(state, feedUrl)
    : null;

  if (resolvedFeed) {
    cloneStatus(episodesFeed, resolvedFeed);
  }

  return {
    data: resolvedFeed || episodesFeed,
    feedUrl,
    shortcutId,
    shortcutTitle: shortcut.title,
    enableDownload,
    isSearchSettingEnabled,
  };
};

EpisodesListScreen.propTypes = {
  ...RssListScreen.propTypes,
};

export const mapDispatchToProps = RssListScreen.createMapDispatchToProps({
  addDownloadedEpisode,
  removeDownloadedEpisode,
  updateAudioPlayerBannerShown: updateAudioPlayerBannerAction,
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(connectStyle(ext('EpisodesListScreen'))(EpisodesListScreen));
