import React from 'react';
import _ from 'lodash';
import autoBind from 'auto-bind';
import { connect } from 'react-redux';
import { connectStyle } from '@shoutem/theme';
import { find, next, shouldRefresh } from '@shoutem/redux-io';
import { navigateTo as navigateToAction } from 'shoutem.navigation';
import { RssListScreen, getLeadImageUrl } from 'shoutem.rss';
import { ListEpisodeView } from '../components/ListEpisodeView';
import { FeaturedEpisodeView } from '../components/FeaturedEpisodeView';
import { getEpisodesFeed, fetchEpisodesFeed } from '../redux';
import { ext, RSS_PODCAST_SCHEMA } from '../const.js';

export class EpisodesListScreen extends RssListScreen {
  static propTypes = {
    ...RssListScreen.propTypes,
  };

  constructor(props, context) {
    super(props, context);
    this.state = {
      ...this.state,
      schema: RSS_PODCAST_SCHEMA,
    };

    autoBind(this);
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
    const { hasFeaturedItem } = this.props;

    return hasFeaturedItem && episode ? (
      <FeaturedEpisodeView
        key={episode.id}
        author={episode.author}
        date={episode.timeUpdated}
        episodeId={episode.id}
        imageUrl={getLeadImageUrl(episode)}
        onPress={this.openEpisodeWithId}
        title={episode.title}
      />
    ) : null;
  }

  renderRow(episode) {
    return (
      <ListEpisodeView
        key={episode.id}
        date={episode.timeUpdated}
        episodeId={episode.id}
        imageUrl={getLeadImageUrl(episode)}
        onPress={this.openEpisodeWithId}
        title={episode.title}
      />
    );
  }
}

export const mapStateToProps = (state, ownProps) => {
  const shortcutId = _.get(ownProps, 'shortcut.id');
  const feedUrl = _.get(ownProps, 'shortcut.settings.feedUrl');
  const data = getEpisodesFeed(state, feedUrl);

  return {
    shortcutId,
    feedUrl,
    data,
  };
};

export const mapDispatchToProps = {
  fetchEpisodesFeed,
  navigateTo: navigateToAction,
  find,
  next,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(connectStyle(ext('EpisodesListScreen'))(EpisodesListScreen));
