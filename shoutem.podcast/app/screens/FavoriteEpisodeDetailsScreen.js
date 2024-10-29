import React from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import { I18n } from 'shoutem.i18n';
import { getRouteParams } from 'shoutem.navigation';
import { EPISODE_DETAILS_SCREEN, ext, getEpisodeTrackId } from '../const';
import { FavoritePodcastPlaylistPlayer } from '../fragments';
import {
  getAllFavoritesData,
  getDownloadedEpisode,
  getHasFavorites,
  getIsFavorited,
} from '../redux';
import {
  EpisodeDetailsScreen,
  mapDispatchToProps,
} from './EpisodeDetailsScreen';

class FavoriteEpisodeDetailsScreen extends EpisodeDetailsScreen {
  renderPlayer() {
    const { allFavoritesData, episode } = this.props;

    return (
      <FavoritePodcastPlaylistPlayer
        favorites={allFavoritesData}
        initialTrackId={getEpisodeTrackId(episode.id)}
        queueLoading={false}
      />
    );
  }
}

function mapStateToProps(state, ownProps) {
  const { id } = getRouteParams(ownProps);

  const allFavoritesData = getAllFavoritesData(state);

  const shortcutFavoritesData =
    _.find(allFavoritesData, favoritesData =>
      _.some(favoritesData.favorites, favorite => favorite.id === id),
    ) ?? {};

  const { shortcut, meta } = shortcutFavoritesData;

  const episode = _.find(
    shortcutFavoritesData.favorites,
    episode => episode.id === id,
  );

  // Handling the case when favorite episode is unfavorited in episode details screen & we go back
  // to favorite list screen.
  // Details screen does not unmount yet & is re-rendering, and it fails to find episode because
  // it was removed from favorites (reducers were updated already).
  // Return empty object so that code doesn't fail, everything will resolve successfully once screen unmounts.
  if (!episode) {
    return { episode: {} };
  }

  const {
    id: shortcutId,
    title: shortcutTitle,
    settings: { enableDownload, feedUrl },
  } = shortcut;

  const enableSharing = _.find(
    shortcut.screens,
    screen => screen.canonicalType === EPISODE_DETAILS_SCREEN,
  )?.settings?.enableSharing;

  const hasFavorites = getHasFavorites(state);
  const isFavorited = getIsFavorited(state, episode.uuid);

  const downloadedEpisode = getDownloadedEpisode(state, id);

  const actionSheetOptions = [I18n.t(ext('actionSheetCancelOption'))];

  if (enableSharing) {
    actionSheetOptions.push(I18n.t(ext('actionSheetShareOption')));
  }

  if (hasFavorites) {
    if (isFavorited) {
      actionSheetOptions.push(I18n.t(ext('actionSheetUnfavorite')));
    } else {
      actionSheetOptions.push(I18n.t(ext('actionSheetFavorite')));
    }
  }

  if (enableDownload && !downloadedEpisode) {
    actionSheetOptions.push(I18n.t(ext('actionSheetDownloadOption')));
  }

  const downloadInProgress = downloadedEpisode?.downloadInProgress;
  // If downloads are disabled after a user has already downloaded an episode
  // we must allow the user to delete the episode to clear space.
  if (downloadedEpisode && !downloadInProgress) {
    actionSheetOptions.push(I18n.t(ext('actionSheetDeleteOption')));
  }

  if (downloadInProgress) {
    actionSheetOptions.push(I18n.t(ext('actionSheetDownloadInProgress')));
  }

  return {
    allFavoritesData,
    actionSheetOptions,
    downloadedEpisode,
    episode,
    feedUrl,
    hasFavorites,
    isFavorited,
    meta,
    shortcutId,
    shortcutTitle,
    enableDownload,
    enableSharing,
  };
}

FavoriteEpisodeDetailsScreen.propTypes = {
  ...EpisodeDetailsScreen.propTypes,
  allFavoritesData: PropTypes.object,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(connectStyle(ext('EpisodeDetailsScreen'))(FavoriteEpisodeDetailsScreen));
