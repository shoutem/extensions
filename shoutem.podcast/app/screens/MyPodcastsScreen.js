import React, { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { ListView, Screen, Toast } from '@shoutem/ui';
import { unavailableInWeb } from 'shoutem.application';
import { I18n } from 'shoutem.i18n';
import { getRouteParams, navigateTo, withIsFocused } from 'shoutem.navigation';
import { ListEpisodeView } from '../components';
import { ext, PODCAST_FAVORITES_PLAYLIST_IDENTIFIER } from '../const';
import { FavoritePodcastPlaylistPlayer } from '../fragments';
import {
  deleteEpisode as deleteEpisodeAction,
  downloadEpisode as downloadEpisodeAction,
  fetchFavoritedEpisodes,
  getAllFavoritedEpisodesMap,
  getAllFavoriteEpisodes,
  getAllFavoritesData,
  getDownloadedEpisodes,
  getFavoriteEpisodesLoading,
  getLastPlayed,
  removeFavoriteEpisode as removeFavoriteEpisodeAction,
  saveFavoriteEpisode as saveFavoriteEpisodeAction,
} from '../redux';
import { resolveDownloadInProgress } from '../services';

export const MyPodcastsScreen = props => {
  const { isFocused } = props;

  const dispatch = useDispatch();

  const deleteEpisode = episode => dispatch(deleteEpisodeAction(episode));
  const downloadEpisode = episode => dispatch(downloadEpisodeAction(episode));
  const saveFavoriteEpisode = (uuid, shortcutId) =>
    dispatch(saveFavoriteEpisodeAction(uuid, shortcutId));
  const removeFavoriteEpisode = uuid =>
    dispatch(removeFavoriteEpisodeAction(uuid));

  // TODO - sort list by episode favorited time.
  // List is currently sorted by shortcuts - episodes are grouped per shortcut, then
  // within each shortcut episodes group, episodes are sorted by favorited time.
  const allFavoritesData = useSelector(getAllFavoritesData);
  const listData = useSelector(getAllFavoriteEpisodes);
  const dataLoading = useSelector(getFavoriteEpisodesLoading);
  const downloadedEpisodes = useSelector(getDownloadedEpisodes);
  const currentlyFavoritedEpisodes = useSelector(getAllFavoritedEpisodesMap);
  const lastPlayedFavoritesTrack = useSelector(state =>
    getLastPlayed(state, PODCAST_FAVORITES_PLAYLIST_IDENTIFIER),
  );

  const fetchFavorites = useCallback(() => {
    try {
      dispatch(fetchFavoritedEpisodes());
    } catch {
      Toast.showError({
        title: I18n.t(ext('fetchFailedTitle')),
        message: I18n.t(ext('fetchFailedMessage')),
      });
    }
  }, [dispatch]);

  useEffect(() => {
    if (isFocused) {
      fetchFavorites();
    }
  }, [isFocused, fetchFavorites]);

  const openFavoriteEpisodeDetailsScreen = id => {
    const episode = _.find(listData, { id });
    const { title } = episode;

    navigateTo(ext('FavoriteEpisodeDetailsScreen'), {
      id,
      analyticsPayload: {
        itemId: id,
        itemName: title,
      },
    });
  };

  const renderRow = episode => {
    const shortcutFavoritesData =
      _.find(allFavoritesData, shortcutFavoritesData =>
        _.some(
          shortcutFavoritesData.favorites,
          favorite => favorite.id === episode.id,
        ),
      ) ?? {};

    const { shortcut, meta } = shortcutFavoritesData;

    const isFavorited = _.some(
      currentlyFavoritedEpisodes[shortcut.id],
      favoriteUuid => favoriteUuid === episode.uuid,
    );

    const downloadInProgress = resolveDownloadInProgress(
      episode.id,
      downloadedEpisodes,
    );

    return (
      <ListEpisodeView
        key={episode.id}
        episode={episode}
        appHasFavoritesShortcut
        isFavorited={isFavorited}
        downloadInProgress={downloadInProgress}
        shortcutId={shortcut.id}
        shortcutTitle={shortcut.title}
        shortcutSettings={shortcut.settings}
        meta={meta}
        onPress={openFavoriteEpisodeDetailsScreen}
        onDelete={unavailableInWeb(deleteEpisode)}
        onDownload={unavailableInWeb(downloadEpisode)}
        onSaveToFavorites={saveFavoriteEpisode}
        onRemoveFromFavorites={removeFavoriteEpisode}
      />
    );
  };

  return (
    <Screen>
      <ListView
        data={listData}
        keyExtractor={episode => episode.id}
        renderRow={renderRow}
        onRefresh={fetchFavorites}
        loading={dataLoading}
        initialListSize={1}
      />
      <FavoritePodcastPlaylistPlayer
        resumePlaylistMode
        favorites={allFavoritesData}
        initialTrackId={lastPlayedFavoritesTrack?.id}
        queueLoading={dataLoading}
        playlistTitle={getRouteParams(props).shortcut.title}
      />
    </Screen>
  );
};

MyPodcastsScreen.propTypes = {
  isFocused: PropTypes.bool.isRequired,
};

export default withIsFocused(MyPodcastsScreen);
