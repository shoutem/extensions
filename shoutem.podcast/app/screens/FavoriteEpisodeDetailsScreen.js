import { connect } from 'react-redux';
import _ from 'lodash';
import { connectStyle } from '@shoutem/theme';
import { I18n } from 'shoutem.i18n';
import { getRouteParams } from 'shoutem.navigation';
import { EPISODE_DETAILS_SCREEN, ext } from '../const';
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

class FavoriteEpisodeDetailsScreen extends EpisodeDetailsScreen {}

function mapStateToProps(state, ownProps) {
  const { id } = getRouteParams(ownProps);

  const allFavoritesData = getAllFavoritesData(state);

  const shortcutFavoritesData =
    _.find(allFavoritesData, favoritesData =>
      _.some(favoritesData.favorites, favorite => favorite.id === id),
    ) ?? {};

  // When favs list screen is focused, we clear redux state and we end up with empty allFavoritesData, before
  // data is updated from fetch response.
  // We do early return because we can't calculate the rest of values without this value.
  if (_.isEmpty(shortcutFavoritesData)) {
    return { episode: {}, shortcutId: '' };
  }

  const { shortcut, meta } = shortcutFavoritesData;

  const episode = _.find(
    shortcutFavoritesData.favorites,
    episode => episode.id === id,
  );

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

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(connectStyle(ext('EpisodeDetailsScreen'))(FavoriteEpisodeDetailsScreen));
