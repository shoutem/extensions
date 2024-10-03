import React from 'react';
import { connect } from 'react-redux';
import autoBindReact from 'auto-bind/react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { getMeta, isInitialized } from '@shoutem/redux-io';
import { connectStyle } from '@shoutem/theme';
import { unavailableInWeb } from 'shoutem.application';
import { getRouteParams, navigateTo } from 'shoutem.navigation';
import { RssListScreen } from 'shoutem.rss';
import { FeaturedEpisodeView, ListEpisodeView } from '../components';
import { EPISODES_COLLECTION_TAG, ext, RSS_PODCAST_SCHEMA } from '../const';
import { PodcastPlaylistPlayer } from '../fragments';
import {
  deleteEpisode,
  downloadEpisode,
  getAllFavoritedEpisodesMap,
  getDownloadedEpisodes,
  getEpisodesFeed,
  getHasFavorites,
  getIsFavorited,
  removeFavoriteEpisode,
  saveFavoriteEpisode,
} from '../redux';
import { resolveDownloadInProgress } from '../services';

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
    const { data } = this.props;
    const {
      shortcut: { id: shortcutId },
    } = getRouteParams(this.props);

    const episode = _.find(data, { id });

    navigateTo(ext('EpisodeDetailsScreen'), {
      id,
      shortcutId,
      meta: getMeta(data),
      analyticsPayload: {
        itemId: id,
        itemName: episode.title,
      },
    });
  }

  getListProps() {
    const { downloadedEpisodes, shortcutFavoritedEpisodes } = this.props;

    return { extraData: { downloadedEpisodes, shortcutFavoritedEpisodes } };
  }

  renderFeaturedItem(episode) {
    const {
      data,
      downloadedEpisodes,
      hasFavorites,
      isFavorited,
      deleteEpisode,
      downloadEpisode,
      saveFavoriteEpisode,
      removeFavoriteEpisode,
    } = this.props;
    const {
      screenSettings,
      shortcut: {
        id: shortcutId,
        title: shortcutTitle,
        settings: shortcutSettings,
      },
    } = getRouteParams(this.props);

    // TODO
    // Featured item render fn has episode undefined while data = [], on initial load.
    // List shouldn't be rendering rows if there's no data.
    if (!screenSettings.hasFeaturedItem || !episode) {
      return null;
    }

    const isFavoriteEpisode = isFavorited(episode);

    const downloadInProgress = resolveDownloadInProgress(
      episode.id,
      downloadedEpisodes,
    );

    return (
      <FeaturedEpisodeView
        key={episode.id}
        episode={episode}
        appHasFavoritesShortcut={hasFavorites}
        isFavorited={isFavoriteEpisode}
        downloadInProgress={downloadInProgress}
        shortcutId={shortcutId}
        shortcutTitle={shortcutTitle}
        shortcutSettings={shortcutSettings}
        meta={getMeta(data)}
        onPress={this.openEpisodeWithId}
        onDelete={unavailableInWeb(deleteEpisode)}
        onDownload={unavailableInWeb(downloadEpisode)}
        onSaveToFavorites={saveFavoriteEpisode}
        onRemoveFromFavorites={removeFavoriteEpisode}
      />
    );
  }

  renderRow(episode) {
    const {
      data,
      downloadedEpisodes,
      hasFavorites,
      isFavorited,
      deleteEpisode,
      downloadEpisode,
      saveFavoriteEpisode,
      removeFavoriteEpisode,
    } = this.props;
    const {
      shortcut: {
        id: shortcutId,
        title: shortcutTitle,
        settings: shortcutSettings,
      },
    } = getRouteParams(this.props);

    const isFavoriteEpisode = isFavorited(episode);

    const downloadInProgress = resolveDownloadInProgress(
      episode.id,
      downloadedEpisodes,
    );

    return (
      <ListEpisodeView
        key={episode.id}
        episode={episode}
        appHasFavoritesShortcut={hasFavorites}
        isFavorited={isFavoriteEpisode}
        downloadInProgress={downloadInProgress}
        shortcutId={shortcutId}
        shortcutTitle={shortcutTitle}
        shortcutSettings={shortcutSettings}
        meta={getMeta(data)}
        onPress={this.openEpisodeWithId}
        onDelete={unavailableInWeb(deleteEpisode)}
        onDownload={unavailableInWeb(downloadEpisode)}
        onSaveToFavorites={saveFavoriteEpisode}
        onRemoveFromFavorites={removeFavoriteEpisode}
      />
    );
  }

  renderFooter() {
    const { data } = this.props;

    // Wait until initial data is fetched and initialized, then render player. Only after initial data
    // is initialized, player is ready to resolve queue logic.
    if (!isInitialized(data)) {
      return null;
    }

    const {
      shortcut: { id: shortcutId, title: shortcutTitle },
    } = getRouteParams(this.props);

    const meta = getMeta(data);

    return (
      <PodcastPlaylistPlayer
        data={data}
        title={shortcutTitle}
        meta={meta}
        shortcutId={shortcutId}
      />
    );
  }
}

export const mapStateToProps = (state, ownProps) => {
  const { shortcut } = getRouteParams(ownProps);
  const settings = shortcut?.settings || {};
  const { feedUrl } = settings;

  const episodesFeed = getEpisodesFeed(state, feedUrl);
  const downloadedEpisodes = getDownloadedEpisodes(state);

  const hasFavorites = getHasFavorites(state);
  const isFavorited = episode => getIsFavorited(state, episode.uuid);
  const shortcutFavoritedEpisodes = _.get(
    getAllFavoritedEpisodesMap(state),
    shortcut.id,
    [],
  );

  return {
    data: episodesFeed,
    downloadedEpisodes,
    shortcutFavoritedEpisodes,
    isFavorited,
    hasFavorites,
    // Below props are required because RssListScreen expects them to be mapped in props.
    // TODO - refactor RssListScreen not to expect below props. Each screen should extract
    // required data & only have data mapped in props.
    feedUrl,
    shortcutId: shortcut.id,
  };
};

EpisodesListScreen.propTypes = {
  ...RssListScreen.propTypes,
  deleteEpisode: PropTypes.func.isRequired,
  downloadedEpisodes: PropTypes.array.isRequired,
  downloadEpisode: PropTypes.func.isRequired,
  getDownloadedEpisodes: PropTypes.func.isRequired,
  hasFavorites: PropTypes.bool.isRequired,
  removeFavoriteEpisode: PropTypes.func.isRequired,
  saveFavoriteEpisode: PropTypes.func.isRequired,
};

export const mapDispatchToProps = RssListScreen.createMapDispatchToProps({
  deleteEpisode,
  downloadEpisode,
  getDownloadedEpisodes,
  removeFavoriteEpisode,
  saveFavoriteEpisode,
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(connectStyle(ext('EpisodesListScreen'))(EpisodesListScreen));
