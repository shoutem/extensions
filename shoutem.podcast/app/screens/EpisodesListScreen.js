import React from 'react';
import autoBindReact from 'auto-bind/react';
import _ from 'lodash';
import { connect } from 'react-redux';
import { connectStyle } from '@shoutem/theme';
import { cloneStatus, find, next, shouldRefresh } from '@shoutem/redux-io';
import { navigateTo as navigateToAction } from 'shoutem.navigation';
import { RssListScreen } from 'shoutem.rss';
import { ListEpisodeView, FeaturedEpisodeView } from '../components';
import { ext, RSS_PODCAST_SCHEMA } from '../const';
import {
  addDownloadedEpisode,
  fetchEpisodesFeed,
  getEpisodesFeedWithDownloads,
  getEpisodesFeed,
  removeDownloadedEpisode,
} from '../redux';

export class EpisodesListScreen extends RssListScreen {
  static propTypes = {
    ...RssListScreen.propTypes,
  };

  constructor(props, context) {
    super(props, context);

    autoBindReact(this);

    this.state = {
      ...this.state,
      schema: RSS_PODCAST_SCHEMA,
    };
  }

  componentDidMount() {
    const { data, fetchEpisodesFeed, shortcutId } = this.props;

    if (shouldRefresh(data)) {
      fetchEpisodesFeed(shortcutId);
    }
  }

  openEpisodeWithId(id) {
    const { navigateTo, feedUrl } = this.props;

    const route = {
      screen: ext('EpisodeDetailsScreen'),
      props: {
        id,
        feedUrl,
      },
    };

    navigateTo(route);
  }

  getNextEpisode(episode) {
    const { data } = this.props;

    const currentEpisodeIndex = _.findIndex(data, { id: episode.id });

    return data[currentEpisodeIndex + 1];
  }

  renderFeaturedItem(episode) {
    const { enableDownload, feedUrl, hasFeaturedItem } = this.props;

    return hasFeaturedItem && episode ? (
      <FeaturedEpisodeView
        key={episode.id}
        feedUrl={feedUrl}
        enableDownload={enableDownload}
        episode={episode}
        onPress={this.openEpisodeWithId}
      />
    ) : null;
  }

  renderRow(episode) {
    const { enableDownload, feedUrl } = this.props;

    return (
      <ListEpisodeView
        key={episode.id}
        enableDownload={enableDownload}
        episode={episode}
        feedUrl={feedUrl}
        onPress={this.openEpisodeWithId}
      />
    );
  }
}

export const mapStateToProps = (state, ownProps) => {
  const shortcutId = _.get(ownProps, 'shortcut.id');
  const settings = ownProps.shortcut?.settings || {};
  const { feedUrl, enableDownload } = settings;
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
    enableDownload,
  };
};

export const mapDispatchToProps = {
  addDownloadedEpisode,
  removeDownloadedEpisode,
  fetchEpisodesFeed,
  navigateTo: navigateToAction,
  find,
  next,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(connectStyle(ext('EpisodesListScreen'))(EpisodesListScreen));
