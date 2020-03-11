import React from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';

import { connectStyle } from '@shoutem/theme';
import { find, next } from '@shoutem/redux-io';

import { navigateTo as navigateToAction } from 'shoutem.navigation';
import { RssListScreen, getLeadImageUrl } from 'shoutem.rss';

import { ListEpisodeView } from '../components/ListEpisodeView';
import { FeaturedEpisodeView } from '../components/FeaturedEpisodeView';
import { RSS_PODCAST_SCHEMA, getEpisodesFeed } from '../redux';
import { ext } from '../const.js';

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

    this.openEpisode = this.openEpisode.bind(this);
    this.openEpisodeWithId = this.openEpisodeWithId.bind(this);
    this.renderRow = this.renderRow.bind(this);
    this.renderFeaturedItem = this.renderFeaturedItem.bind(this);
  }

  openEpisode(episode) {
    const { navigateTo } = this.props;
    const nextEpisode = this.getNextEpisode(episode);

    const route = {
      screen: ext('EpisodeDetailsScreen'),
      title: episode.title,
      props: {
        episode,
        nextEpisode,
        openEpisode: this.openEpisode,
      },
    };

    navigateTo(route);
  }

  openEpisodeWithId(id) {
    const { data } = this.props;

    const episode = _.find(data, { id });

    this.openEpisode(episode);
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
  const feedUrl = _.get(ownProps, 'shortcut.settings.feedUrl');
  const data = getEpisodesFeed(state, feedUrl);

  return {
    feedUrl,
    data,
  };
};

export const mapDispatchToProps = { navigateTo: navigateToAction, find, next };

export default connect(mapStateToProps, mapDispatchToProps)(
  connectStyle(ext('EpisodesListScreen'))(EpisodesListScreen),
);
